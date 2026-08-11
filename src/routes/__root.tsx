import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import type { ConvexQueryClient } from "@convex-dev/react-query";
import type { QueryClient } from "@tanstack/react-query";
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
				content: "#ffffff",
			},
			{
				title: "epilog",
			},
			{
				name: "color-scheme",
				content: "light dark",
			},
		],
		links: [{ rel: "stylesheet", href: appCss }],
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
		</ConvexBetterAuthProvider>
	);
}

function ThemeColorSync() {
	useEffect(() => {
		const updateThemeColor = () => {
			const isDark = document.documentElement.classList.contains("dark");
			const themeColor =
				document.querySelector<HTMLMetaElement>("meta#theme-color");

			themeColor?.setAttribute("content", isDark ? "#0a0a0a" : "#ffffff");
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
