import { betterAuthComponent } from "@convex/auth";
import { convexAdapter } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth } from "better-auth";
import type { GenericCtx } from "../../convex/_generated/server";

export const createAuth = (ctx: GenericCtx) =>
  betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    database: convexAdapter(ctx, betterAuthComponent),

    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,

        // Google only issues a refresh token the first time a user consents to your app. If the user has already authorized your app, subsequent OAuth flows will only return an access token, not a refresh token.
        // To always get a refresh token, you can set the accessType to offline, and prompt to select_account+consent in the provider options
        // Source - BETTER-AUTH Docs
        accessType: "offline",
        prompt: "select_account+consent",
      },
    },
    plugins: [convex()],
  });
