import type { Id } from "@convex/_generated/dataModel";
import type { QueryCtx } from "../_generated/server";

export async function getCurrentUserOrThrow(
	ctx: QueryCtx,
): Promise<Id<"users">> {
	const auth = await ctx.auth.getUserIdentity();
	if (!auth) {
		throw new Error("Unauthorized");
	}

	try {
		const authId = auth.subject;
		const user = await ctx.db
			.query("users")
			.withIndex("by_auth_id", (q) => q.eq("authId", authId))
			.first();
		if (!user) {
			throw new Error("Unauthorized");
		}
		return user._id;
	} catch {
		throw new Error("Unauthorized");
	}
}
