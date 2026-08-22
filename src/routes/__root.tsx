import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import type { ConvexQueryClient } from "@convex-dev/react-query";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
	useRouteContext,
} from "@tanstack/react-router";
import { ThemeProvider } from "better-themes";
import { useEffect, type ReactNode } from "react";
import { getAuth } from "@/actions/get-auth";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { authClient } from "@/lib/auth-client";
import appCss from "@/styles/app.css?url";

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient;
	convexQueryClient: ConvexQueryClient;
}>()({
	beforeLoad: async (ctx) => {
		const token = await getAuth();
		if (token) {
			ctx.context.convexQueryClient.serverHttpClient?.setAuth(token);
		}
		return {
			isAuthenticated: !!token,
			token,
		};
	},
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content:
					"width=device-width, initial-scale=1, viewport-fit=cover",
			},
			{
				id: "theme-color",
				name: "theme-color",
				content: "#f4eee4",
			},
			{
				title: "epilog",
			},
			{
				name: "color-scheme",
				content: "light dark",
			},
			{
				name: "mobile-web-app-capable",
				content: "yes",
			},
			{
				name: "apple-mobile-web-app-capable",
				content: "yes",
			},
			{
				name: "apple-mobile-web-app-status-bar-style",
				content: "black-translucent",
			},
			{
				name: "apple-mobile-web-app-title",
				content: "epilog",
			},
		],
		links: [
			{ rel: "stylesheet", href: appCss },
			{ rel: "manifest", href: "/manifest.webmanifest" },
			{ rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
			{ rel: "apple-touch-icon", href: "/icons/icon-192.png" },
		],
	}),
	component: RootComponent,
});

function RootComponent() {
	const context = useRouteContext({ from: Route.id });

	return (
		<ConvexBetterAuthProvider
			authClient={authClient}
			client={context.convexQueryClient.convexClient}
		>
			<RootDocument>
				<Outlet />
			</RootDocument>
			{import.meta.env.DEV ? (
				<ReactQueryDevtools
					initialIsOpen={false}
					client={context.queryClient}
				/>
			) : null}
		</ConvexBetterAuthProvider>
	);
}

function ThemeColorSync() {
	useEffect(() => {
		const updateThemeColor = () => {
			const isDark = document.documentElement.classList.contains("dark");
			const themeColor =
				document.querySelector<HTMLMetaElement>("meta#theme-color");

			themeColor?.setAttribute("content", isDark ? "#0e0d0c" : "#f4eee4");
		};

		updateThemeColor();
		const observer = new MutationObserver(updateThemeColor);
		observer.observe(document.documentElement, {
			attributeFilter: ["class"],
			attributes: true,
		});

		return () => observer.disconnect();
	}, []);

	return null;
}

function ServiceWorkerRegistration() {
	useEffect(() => {
		if (!import.meta.env.PROD || !("serviceWorker" in navigator)) return;

		void navigator.serviceWorker.register("/sw.js");
	}, []);

	return null;
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<HeadContent />
			</head>
			<body>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					disableTransitionOnChange
					enableSystem
				>
					<TooltipProvider>
						<ServiceWorkerRegistration />
						<ThemeColorSync />
						{children}
					</TooltipProvider>
					<Toaster style={{ fontFamily: "inherit" }} />
				</ThemeProvider>
				<Scripts />
			</body>
		</html>
	);
}
