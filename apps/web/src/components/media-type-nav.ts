import { definePrimitive } from "@ui-sdk/core";

export type MediaTypeNavOptions = { value?: string };

const VARS = [
	"--media-type-nav-underline-inline-start",
	"--media-type-nav-underline-top",
	"--media-type-nav-underline-width",
	"--media-type-nav-underline-height",
] as const;

const mediaTypeNav = definePrimitive({
	name: "media-type-nav",
	options: { value: "string" },
	controlled: ["value"],
	state: (options: MediaTypeNavOptions) => ({
		value: options.value ?? null,
	}),
	api: () => ({}),
	sync: (options) =>
		options.value === undefined ? {} : { value: options.value },
	slots: (slot) => ({
		root: slot({}),
		underline: slot({
			bind: (el, part) => {
				const root = el.closest<HTMLElement>(
					"[data-slot='media-type-nav']",
				);
				if (!root) return;

				let prevBox = "";

				const place = () => {
					const active =
						root.querySelector<HTMLElement>("[data-active]");
					if (!active) {
						if (prevBox) {
							el.removeAttribute("data-positioned");
							for (const name of VARS) {
								el.style.removeProperty(name);
							}
							prevBox = "";
						}
						return;
					}
					const rootRect = root.getBoundingClientRect();
					const rect = active.getBoundingClientRect();
					const rtl = getComputedStyle(root).direction === "rtl";
					const left = rect.left - rootRect.left;
					const right = rootRect.right - rect.right;
					const top = rect.top - rootRect.top;
					const box = `${left},${top},${rect.width},${rect.height},${right},${rtl}`;
					if (box === prevBox) return;
					prevBox = box;
					el.style.setProperty(
						"--media-type-nav-underline-inline-start",
						`${(rtl ? right : left).toFixed(2)}px`,
					);
					el.style.setProperty(
						"--media-type-nav-underline-top",
						`${top.toFixed(2)}px`,
					);
					el.style.setProperty(
						"--media-type-nav-underline-width",
						`${rect.width.toFixed(2)}px`,
					);
					el.style.setProperty(
						"--media-type-nav-underline-height",
						`${rect.height.toFixed(2)}px`,
					);
					el.setAttribute("data-positioned", "");
				};

				place();

				const observer = new ResizeObserver(() => place());
				const observed = new WeakSet<Element>();
				const observeItems = () => {
					for (const child of root.children) {
						if (!observed.has(child)) {
							observer.observe(child);
							observed.add(child);
						}
					}
				};
				observeItems();
				const mutations = new MutationObserver(() => {
					observeItems();
					place();
				});
				mutations.observe(root, { childList: true });

				// The active link's data-active moves in a React commit that
				// can land after the store notifies, so re-measure next frame.
				const unsubscribe = part.store.subscribe(() => {
					requestAnimationFrame(place);
				});

				return () => {
					observer.disconnect();
					mutations.disconnect();
					unsubscribe();
					el.removeAttribute("data-positioned");
					for (const name of VARS) {
						el.style.removeProperty(name);
					}
				};
			},
		}),
	}),
});

export { mediaTypeNav };
