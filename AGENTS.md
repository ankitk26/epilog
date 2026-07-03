<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->

## Agent Instructions

- use pnpm for running scripts
- never run the build script unless asked to do so
- never run any type-check, lint or format unless asked to do so
- never invoke any skills on your own
- respect the app's spacing system in `src/styles/app.css`: use only the allowed values for `space-*` (2 | 3 | 4 | 6 | 8 | 14 | 20), `gap-*` (1 | 2 | 3 | 4 | 6 | 8), `p-*` (0 | 1 | 2 | 3 | 4 | 6 | 8), and `m-*` (0 | 1 | 2 | 4 | 6 | 8); prefer standard Tailwind sizing scales for width/height over arbitrary values
- when overriding shadcn/ui Sheet styles, match the default selector specificity (e.g. `data-[side=right]:w-full`) instead of relying on class order
