import { Id } from "@convex/_generated/dataModel";
import { betterAuthComponent } from "@convex/auth";
import { QueryCtx } from "../_generated/server";

export async function getCurrentUserOrThrow(ctx: QueryCtx) {
  const userMetadata = await betterAuthComponent.getAuthUser(ctx);
  if (!userMetadata) {
    throw new Error("Unauthorized");
  }

  try {
    const userId = userMetadata.userId as Id<"users">;
    return userId;
  } catch {
    throw new Error("Unauthorized");
  }
}
