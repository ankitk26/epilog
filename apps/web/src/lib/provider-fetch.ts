// Shared resilience layer for third-party provider calls (TMDB, MAL,
// OpenLibrary). Wraps a betterFetch call in an Effect with typed failures
// and a retry policy that only re-attempts what a second attempt can fix.
import { Effect, Schedule, Schema } from "effect";
import z from "zod";

export class ProviderUnavailable extends Schema.TaggedError<ProviderUnavailable>()(
	"ProviderUnavailable",
	{
		provider: Schema.String,
		detail: Schema.String,
	},
) {}

export class ProviderRejected extends Schema.TaggedError<ProviderRejected>()(
	"ProviderRejected",
	{
		provider: Schema.String,
		status: Schema.Number,
	},
) {}

export class ProviderBadPayload extends Schema.TaggedError<ProviderBadPayload>()(
	"ProviderBadPayload",
	{
		provider: Schema.String,
		detail: Schema.String,
	},
) {}

export type ProviderError =
	| ProviderUnavailable
	| ProviderRejected
	| ProviderBadPayload;

// The failure shape betterFetch reports when the provider answered: an
// object carrying the HTTP `status`. Anything else means the request never
// completed.
export const providerFetchFailureSchema = z.object({ status: z.number() });
export type ProviderFetchFailure = z.infer<typeof providerFetchFailureSchema>;

// The response envelope betterFetch resolves with: `data` holds the
// zod-validated payload, or `error` the failure above.
export type ProviderResponse<B> = { data: B | null; error: unknown };

// Retries only cover what a second attempt can fix: server-side failures
// and rate limits. Client errors (4xx), payload mismatches, timeouts and
// missing configuration are deterministic — retrying each wastes a
// provider call and up to the full timeout.
export function isTransientProviderError(error: ProviderError): boolean {
	if (error._tag === "ProviderRejected") {
		return error.status >= 500 || error.status === 429;
	}
	if (error._tag === "ProviderUnavailable") {
		return !/\babort\b|timed out|not set/i.test(error.detail);
	}
	return false;
}

const describeCause = (cause: unknown): string => {
	if (cause instanceof Error) {
		if (/abort/i.test(cause.name) || /abort/i.test(cause.message)) {
			return "timed out";
		}
		return `${cause.name}: ${cause.message}`.slice(0, 300);
	}
	return JSON.stringify(cause)?.slice(0, 300) ?? "unknown error";
};

// Wraps one betterFetch call (whose `output` does the zod validation) into
// an Effect: rejection or empty data becomes a typed failure, and transient
// failures get retried with exponential backoff.
export function providerFetch<B>(
	provider: string,
	run: () => Promise<ProviderResponse<B>>,
): Effect.Effect<B, ProviderError> {
	const attempt = Effect.gen(function* () {
		const result = yield* Effect.tryPromise({
			try: run,
			// A rejected promise is either an abort (timeout) or a failed
			// response parse (zod). Both are deterministic, so neither is
			// retried.
			catch: (cause): ProviderError =>
				new ProviderBadPayload({
					provider,
					detail: describeCause(cause),
				}),
		});

		if (result.error || result.data == null) {
			// Parse the failure at this boundary instead of asserting: only a
			// well-formed 4xx response becomes a rejection.
			const failure = providerFetchFailureSchema.safeParse(result.error);
			const status = failure.success ? failure.data.status : undefined;
			if (status !== undefined && status >= 400 && status < 500) {
				return yield* new ProviderRejected({ provider, status });
			}
			return yield* new ProviderUnavailable({
				provider,
				detail:
					result.error instanceof Error
						? describeCause(result.error)
						: result.error
							? JSON.stringify(result.error).slice(0, 300)
							: "empty response",
			});
		}

		return result.data;
	});

	return attempt.pipe(
		Effect.retry({
			times: 2,
			schedule: Schedule.exponential("200 millis"),
			while: isTransientProviderError,
		}),
	);
}

const logProviderError = (error: ProviderError) =>
	Effect.sync(() => {
		const detail =
			"detail" in error ? error.detail : `status ${error.status}`;
		console.error(`[provider] ${error.provider} ${error._tag}: ${detail}`);
	});

// The server-fn boundary. Logs the typed failure with its details (the old
// console.error contract) and throws the plain Error the client expects,
// keeping the typed error as `cause`.
export async function runProvider<A>(
	effect: Effect.Effect<A, ProviderError>,
): Promise<A> {
	return Effect.runPromise(
		effect.pipe(
			Effect.tapError(logProviderError),
			Effect.mapError(
				(error) =>
					new Error(`${error.provider} request failed`, {
						cause: error,
					}),
			),
		),
	);
}

// For providers where a failure degrades gracefully (e.g. a creator name is
// optional): logs like runProvider but resolves to the fallback instead of
// throwing.
export async function runProviderOrElse<A, F>(
	effect: Effect.Effect<A, ProviderError>,
	fallback: F,
): Promise<A | F> {
	return Effect.runPromise(
		effect.pipe(
			Effect.tapError(logProviderError),
			Effect.catchIf(
				() => true,
				() => Effect.succeed(fallback),
			),
		),
	);
}
