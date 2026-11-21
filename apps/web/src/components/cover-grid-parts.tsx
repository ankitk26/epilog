"use client";

import { createParts } from "@ui-sdk/react/primitive";
import { coverGrid } from "./cover-grid";

const { Root: CoverGrid, Tile: CoverGridTile } = createParts(coverGrid, {
	root: "div",
	tile: "button",
});

export { CoverGrid, CoverGridTile };
