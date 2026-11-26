import { assert, describe, it } from "@effect/vitest";
// Tests for the shared provider resilience layer: typed failures, the
// retry policy (only transient failures retry), and the server-fn
// boundary mapping. Bodies are Effects — @effect/vitest runs them itself.
import { Effect } from "effect";
import {
	isTransientProviderError,
	ProviderBadPayload,
	ProviderRejected,
	ProviderUnavailable,
	providerFetch,
	runProvider,
	runProviderOrElse,
} from "./provider-fetch";

function flakyFetch(
	failuresBeforeSuccess: number,
	error: unknown,
): {
	run: () => Promise<{ data: { ok: true } | null; error: unknown }>;
	attempts: () => number;
} {
	let attempts = 0;
	return {
		run: () => {
			attempts++;
			if (attempts <= failuresBeforeSuccess) {
				return Promise.resolve({ data: null, error });
			}
			return Promise.resolve({ data: { ok: true }, error: null });
		},
		attempts: () => attempts,
	};
}

describe("providerFetch", () => {
	it.live("retries transient failures and succeeds", () =>
		Effect.gen(function* () {
			const fetch = flakyFetch(2, { status: 500 });
			const result = yield* providerFetch("test", fetch.run);
			assert.strictEqual(fetch.attempts(), 3);
			assert.deepStrictEqual(result, { ok: true });
		}),
	);

	it.live("retries rate limits (429)", () =>
		Effect.gen(function* () {
			const fetch = flakyFetch(1, { status: 429 });
			const result = yield* providerFetch("test", fetch.run);
			assert.strictEqual(fetch.attempts(), 2);
			assert.deepStrictEqual(result, { ok: true });
		}),
	);

	it.live("does not retry client errors (404)", () =>
		Effect.gen(function* () {
			const fetch = flakyFetch(1, { status: 404 });
			const error = yield* Effect.flip(providerFetch("test", fetch.run));
			assert.strictEqual(error._tag, "ProviderRejected");
			assert.strictEqual(error.status, 404);
			assert.strictEqual(fetch.attempts(), 1);
		}),
	);

	it.live("does not retry payload failures", () =>
		Effect.gen(function* () {
			let attempts = 0;
			const error = yield* Effect.flip(
				providerFetch("test", () => {
					attempts++;
					return Promise.reject(
						new TypeError("Cannot read properties of undefined"),
					);
				}),
			);
			assert.strictEqual(error._tag, "ProviderBadPayload");
			assert.strictEqual(attempts, 1);
		}),
	);

	it.live("does not retry timeouts", () =>
		Effect.gen(function* () {
			let attempts = 0;
			const error = yield* Effect.flip(
				providerFetch("test", () => {
					attempts++;
					return Promise.resolve({
						data: null,
						error: new Error(
							"The operation was aborted due to timeout",
						),
					});
				}),
			);
			assert.strictEqual(error._tag, "ProviderUnavailable");
			assert.match(error.detail, /timed out/i);
			assert.strictEqual(attempts, 1);
		}),
	);

	it("empty data with no error is unavailable", () =>
		Effect.gen(function* () {
			const error = yield* Effect.flip(
				providerFetch("test", () =>
					Promise.resolve({ data: null, error: null }),
				),
			);
			assert.strictEqual(error._tag, "ProviderUnavailable");
		}));
});

describe("isTransientProviderError", () => {
	it("retries 5xx and 429 only", () => {
		assert.isTrue(
			isTransientProviderError(
				new ProviderRejected({ provider: "t", status: 502 }),
			),
		);
		assert.isTrue(
			isTransientProviderError(
				new ProviderRejected({ provider: "t", status: 429 }),
			),
		);
		assert.isFalse(
			isTransientProviderError(
				new ProviderRejected({ provider: "t", status: 404 }),
			),
		);
	});

	it("retries network unavailability but not timeouts or config gaps", () => {
		assert.isTrue(
			isTransientProviderError(
				new ProviderUnavailable({
					provider: "t",
					detail: "socket hang up",
				}),
			),
		);
		assert.isFalse(
			isTransientProviderError(
				new ProviderUnavailable({ provider: "t", detail: "timed out" }),
			),
		);
		assert.isFalse(
			isTransientProviderError(
				new ProviderUnavailable({
					provider: "t",
					detail: "TMDB_TOKEN is not set",
				}),
			),
		);
		assert.isFalse(
			isTransientProviderError(
				new ProviderBadPayload({ provider: "t", detail: "zod" }),
			),
		);
	});
});

describe("runProvider", () => {
	it("passes successes through", () =>
		Effect.gen(function* () {
			const result = yield* Effect.promise(() =>
				runProvider(Effect.succeed(42)),
			);
			assert.strictEqual(result, 42);
		}));

	it("throws a plain Error with the typed error as cause", () =>
		Effect.gen(function* () {
			const error = yield* Effect.promise(() =>
				runProvider(
					Effect.fail(
						new ProviderUnavailable({
							provider: "tmdb",
							detail: "down",
						}),
					),
				).then(
					() => null,
					(e: Error) => e,
				),
			);
			assert.instanceOf(error, Error);
			assert.match(error?.message ?? "", /tmdb request failed/);
			assert.strictEqual(
				(error?.cause as ProviderUnavailable)._tag,
				"ProviderUnavailable",
			);
		}));
});

describe("runProviderOrElse", () => {
	it("resolves to the fallback on failure", () =>
		Effect.gen(function* () {
			const result = yield* Effect.promise(() =>
				runProviderOrElse(
					Effect.fail(
						new ProviderUnavailable({
							provider: "tmdb",
							detail: "down",
						}),
					),
					null,
				),
			);
			assert.strictEqual(result, null);
		}));

	it("passes successes through", () =>
		Effect.gen(function* () {
			const result = yield* Effect.promise(() =>
				runProviderOrElse(Effect.succeed("name"), null),
			);
			assert.strictEqual(result, "name");
		}));
});
