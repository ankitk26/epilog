import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { lazyPlugins, defineConfig } from "vite-plus";

export default defineConfig({
	fmt: {
		ignorePatterns: [
			"pnpm-lock.yaml",
			"convex/_generated/*",
			"src/routeTree.gen.ts",
		],
		useTabs: true,
		tabWidth: 4,
		printWidth: 80,
		sortImports: {
			newlinesBetween: false,
		},
		sortTailwindcss: {
			stylesheet: "./src/styles/app.css",
			functions: ["clsx", "cn"],
		},
	},
	lint: {
		plugins: ["typescript", "unicorn", "oxc"],
		categories: {
			correctness: "error",
		},
		rules: {
			"vite-plus/prefer-vite-plus-imports": "error",
		},
		env: {
			builtin: true,
		},
		options: {
			typeAware: true,
			typeCheck: true,
		},
		jsPlugins: [
			{
				name: "vite-plus",
				specifier: "vite-plus/oxlint-plugin",
			},
		],
	},
	server: {
		port: 3000,
	},
	resolve: {
		tsconfigPaths: true,
	},
	plugins: lazyPlugins(() => [
		tailwindcss(),
		tanstackStart(),
		nitro(),
		viteReact(),
	]),
	ssr: {
		noExternal: ["@convex-dev/better-auth"],
	},
});
