"use client";

import { createParts } from "@ui-sdk/react/primitive";
import { mediaTypeNav } from "./media-type-nav";

const { Root: MediaTypeNav, Underline: MediaTypeNavUnderline } = createParts(
	mediaTypeNav,
	{ root: "nav", underline: "span" },
);

export { MediaTypeNav, MediaTypeNavUnderline };
