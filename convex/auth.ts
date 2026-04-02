import { betterAuth } from "better-auth/minimal";
import { createClient } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import authConfig from "./auth.config";
import { components } from "./_generated/api";
import { query } from "./_generated/server";
import type { GenericCtx } from "@convex-dev/better-auth";
import type { DataModel } from "./_generated/dataModel";

const siteUrl = process.env.SITE_URL!;

export const authComponent = createClient<DataModel>(components.betterAuth);

export const createAuth = (ctx: GenericCtx<DataModel>) => {
	return betterAuth({
		baseURL: siteUrl,
		database: authComponent.adapter(ctx),
		session: {
			cookieCache: {
				enabled: true,
				maxAge: 5 * 60,
			},
			expiresIn: 60 * 60 * 24 * 7,
			updateAge: 60 * 60 * 24,
		},

		socialProviders: {
			google: {
				clientId: process.env.GOOGLE_CLIENT_ID as string,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,

				// Google only issues a refresh token the first time a user consents to your app. If the user has already authorized your app, subsequent OAuth flows will only return an access token, not a refresh token.
				// To always get a refresh token, you can set the accessType to offline, and prompt to select_account+consent in the provider options
				// Source - BETTER-AUTH Docs
				accessType: "offline",
				prompt: "select_account",
			},
		},
		plugins: [
			// The Convex plugin is required for Convex compatibility
			convex({ authConfig }),
		],
	});
};

// Example function for getting the current user
// Feel free to edit, omit, etc.
export const getCurrentUser = query({
	args: {},
	handler: async (ctx) => {
		return await authComponent.getAuthUser(ctx);
	},
});
