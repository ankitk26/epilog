/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as http from "../http.js";
import type * as lib_mediaSnapshots from "../lib/mediaSnapshots.js";
import type * as lib_mediaStatuses from "../lib/mediaStatuses.js";
import type * as lib_standardizePersonName from "../lib/standardizePersonName.js";
import type * as logs from "../logs.js";
import type * as migrations_backfillLogMediaSnapshots from "../migrations/backfillLogMediaSnapshots.js";
import type * as model_users from "../model/users.js";
import type * as movieEvents from "../movieEvents.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  http: typeof http;
  "lib/mediaSnapshots": typeof lib_mediaSnapshots;
  "lib/mediaStatuses": typeof lib_mediaStatuses;
  "lib/standardizePersonName": typeof lib_standardizePersonName;
  logs: typeof logs;
  "migrations/backfillLogMediaSnapshots": typeof migrations_backfillLogMediaSnapshots;
  "model/users": typeof model_users;
  movieEvents: typeof movieEvents;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  betterAuth: import("@convex-dev/better-auth/_generated/component.js").ComponentApi<"betterAuth">;
};
