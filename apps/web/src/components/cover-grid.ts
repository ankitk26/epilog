import {
	createChange,
	createRovingFocus,
	definePrimitive,
	type ChangeDetails,
} from "@ui-sdk/core";

type CoverGridOptions = {
	value?: string;
	onValueChange?: (
		value: string,
		details: ChangeDetails<"item-press" | "list-navigation">,
	) => void;
	// Enter on a tile submits it; the app decides whether the change is
	// worth applying.
	onApply?: (value: string, event?: Event) => void;
};

const coverGrid = definePrimitive({
	name: "cover-grid",
	options: {
		value: "string",
		onValueChange: "callback",
		onApply: "callback",
	},
	controlled: ["value"],
	state: (options: CoverGridOptions) => ({
		value: options.value ?? "",
		// SAFETY: no tile is focused before the grid renders.
		focused: null as string | null,
	}),
	sync: (options) =>
		options.value === undefined ? {} : { value: options.value },
	api: (context) => {
		const change = createChange(context);
		const roving = createRovingFocus(context, {
			slot: "tile",
			key: "focused",
			orientation: () => "both",
			preferred: (tile) => tile.key === context.store.get().value,
			claims: (state, tile) => state.value === tile.key,
			move: (event, { from, items, rtl }) => {
				// Group the tiles by their offsetTop, so the grid's columns
				// can change with the breakpoint without anyone counting them.
				const rows: { top: number; tiles: (typeof items)[number][] }[] =
					[];
				for (const tile of items) {
					const top = tile.el.offsetTop;
					const row = rows[rows.length - 1];
					if (row && Math.abs(row.top - top) < 4) {
						row.tiles.push(tile);
					} else {
						rows.push({ top, tiles: [tile] });
					}
				}
				const fromRow = rows.findIndex((row) =>
					row.tiles.includes(from),
				);
				const fromCol = rows[fromRow].tiles.indexOf(from);
				const { key } = event;
				if (key === "Home") return items[0]?.key;
				if (key === "End") return items[items.length - 1]?.key;
				if (key === "ArrowLeft" || key === "ArrowRight") {
					const forward = (key === "ArrowRight") !== rtl;
					return rows[fromRow].tiles[
						forward ? fromCol + 1 : fromCol - 1
					]?.key;
				}
				const targetRow =
					rows[key === "ArrowDown" ? fromRow + 1 : fromRow - 1];
				if (!targetRow) return undefined;
				return targetRow.tiles[
					Math.min(fromCol, targetRow.tiles.length - 1)
				]?.key;
			},
		});

		return {
			roving,
			keydown(event: KeyboardEvent, el: HTMLElement) {
				const moved = roving.keydown(event, el);
				// Selection follows focus, like the status list.
				if (moved) {
					change("value", moved.key, {
						reason: "list-navigation",
						event,
					});
				}
			},
			select(key: string, event?: Event) {
				change("value", key, { reason: "item-press", event });
			},
			submit(key: string, event?: Event) {
				const { onApply } = context.options();
				if (!onApply) return;
				change("value", key, { reason: "item-press", event });
				onApply(key, event);
			},
		};
	},
	slots: (slot) => ({
		root: slot({
			attrs: () => ({ role: "listbox" }),
		}),
		tile: slot<{ value: string }>({
			props: { value: "string" },
			state: (state, part) => ({ selected: state.value === part.key }),
			attrs: (state, part) => ({
				type: "button",
				role: "option",
				"aria-selected": String(state.value === part.key),
				tabindex: part.api.roving.tabIndex(state, part),
			}),
			press: ({ api, key }, event) => api.select(key, event),
			on: {
				keydown: (event, { el, api, key }) => {
					if (!el) return;
					if (event.key === "Enter") {
						event.preventDefault();
						api.submit(key, event);
						return;
					}
					api.keydown(event, el);
				},
			},
			bind: (el, part) => part.api.roving.bind(el, part),
		}),
	}),
	agent: { actions: ["select", "submit"], closed: true },
});

export { coverGrid, type CoverGridOptions };
