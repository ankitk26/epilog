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
import type * as logs from "../logs.js";
import type * as migrations__helpers from "../migrations/_helpers.js";
import type * as migrations__mutations from "../migrations/_mutations.js";
import type * as migrations__queries from "../migrations/_queries.js";
import type * as migrations_backfillCreators from "../migrations/backfillCreators.js";
import type * as migrations_convertOlMangaToMalManga from "../migrations/convertOlMangaToMalManga.js";
import type * as migrations_flipOlMangaToMangaType from "../migrations/flipOlMangaToMangaType.js";
import type * as migrations_migrateStatuses from "../migrations/migrateStatuses.js";
import type * as migrations_normalizeOlBookSourceIds from "../migrations/normalizeOlBookSourceIds.js";
import type * as migrations_removeUnusedMedia from "../migrations/removeUnusedMedia.js";
import type * as migrations_separateMangaAndStandardizeSourceIds from "../migrations/separateMangaAndStandardizeSourceIds.js";
import type * as migrations_updateBookCovers from "../migrations/updateBookCovers.js";
import type * as model_users from "../model/users.js";
import type * as movieEvents from "../movieEvents.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  http: typeof http;
  logs: typeof logs;
  "migrations/_helpers": typeof migrations__helpers;
  "migrations/_mutations": typeof migrations__mutations;
  "migrations/_queries": typeof migrations__queries;
  "migrations/backfillCreators": typeof migrations_backfillCreators;
  "migrations/convertOlMangaToMalManga": typeof migrations_convertOlMangaToMalManga;
  "migrations/flipOlMangaToMangaType": typeof migrations_flipOlMangaToMangaType;
  "migrations/migrateStatuses": typeof migrations_migrateStatuses;
  "migrations/normalizeOlBookSourceIds": typeof migrations_normalizeOlBookSourceIds;
  "migrations/removeUnusedMedia": typeof migrations_removeUnusedMedia;
  "migrations/separateMangaAndStandardizeSourceIds": typeof migrations_separateMangaAndStandardizeSourceIds;
  "migrations/updateBookCovers": typeof migrations_updateBookCovers;
  "model/users": typeof model_users;
  movieEvents: typeof movieEvents;
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
