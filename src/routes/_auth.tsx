import { createFileRoute, Outlet, redirect, useSearch } from "@tanstack/react-router";
import Header from "@/components/header";
import type { MediaType } from "@/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_auth")({
	component: AuthWrapper,
	beforeLoad: ({ context }) => {
		if (!context.isAuthenticated) {
			throw redirect({ to: "/sign-in" });
		}
	},
});

const orbByType: Record<MediaType, string> = {
	movie: "orb-mint",
	tv: "orb-sky",
	anime: "orb-lavender",
	book: "orb-peach",
};

function Atmosphere() {
	const search = useSearch({ strict: false }) as { type?: MediaType };
	const orbClass = orbByType[search.type ?? "movie"] ?? "orb-rose";

	return (
		<div
			aria-hidden
			className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
		>
			<div
				className={cn(
					"orb animate-orb-drift",
					orbClass,
					"right-[-12rem] top-[-14rem] size-[34rem]",
				)}
			/>
			<div
				className={cn(
					"orb animate-orb-drift-2 orb-rose",
					"bottom-[-16rem] left-[-10rem] size-[30rem]",
				)}
			/>
			<div
				className={cn(
					"orb animate-orb-drift orb-lavender",
					"left-[42%] top-[28%] size-[20rem] opacity-30",
				)}
			/>
		</div>
	);
}

function AuthWrapper() {
	return (
		<div className="relative flex min-h-screen flex-col">
			<Atmosphere />
			<Header />
			<main className="relative z-10 flex-1 py-8 lg:py-12">
				<div className="mx-auto max-w-7xl px-5 lg:px-8">
					<Outlet />
				</div>
			</main>
		</div>
	);
}
