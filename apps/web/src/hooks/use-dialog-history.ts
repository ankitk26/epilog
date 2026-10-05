"use client";

import { useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════════
// Global back-button intercept
// ═══════════════════════════════════════════════════════════════

let hasGuard = false;
let manualClose = false;
let suppressBackOnce = false;
let nextId = 0;
let hasInstalledBackHandler = false;

// Active dialog callbacks (stack — top = most recently opened)
type CallbackEntry = { id: number; close: () => void };
const callbacks: CallbackEntry[] = [];

// ── Keyboard helpers ────────────────────────────────────────

function isInputFocused(): boolean {
	const el = document.activeElement;
	if (!(el instanceof HTMLElement)) return false;
	return (
		el.tagName === "INPUT" ||
		el.tagName === "TEXTAREA" ||
		el.isContentEditable ||
		el.getAttribute("role") === "textbox"
	);
}

function blurActiveInput(): void {
	const el = document.activeElement;
	if (el instanceof HTMLElement) el.blur();
}

// ── Stack management ────────────────────────────────────────

function addCallback(close: () => void): number {
	const id = ++nextId;
	callbacks.push({ id, close });
	if (callbacks.length === 1) {
		hasGuard = true;
		// Preserve TanStack Router's history metadata so links clicked from the
		// dialog can calculate their next history index correctly.
		history.pushState({ ...history.state, __epilogGuard: true }, "");
	}
	return id;
}

function removeCallback(id: number): void {
	const idx = callbacks.findIndex((c) => c.id === id);
	if (idx !== -1) callbacks.splice(idx, 1);

	// The caller is leaving the page entirely (clicking a router link from
	// inside the dialog). The guard entry is already below the new route
	// entry, so popping it with history.back() would fight the navigation
	// and undo it. Drop the guard silently; the next popstate consumes it.
	if (suppressBackOnce) {
		suppressBackOnce = false;
		manualClose = false;
		hasGuard = false;
		callbacks.length = 0;
		return;
	}

	if (callbacks.length === 0 && hasGuard) {
		hasGuard = false;
		manualClose = true;
		history.back();
	}
}

// ── Using dialogs with router navigation ────────────────────

/**
 * Arms the dismiss-intercept to skip its `history.back()` when this
 * dialog closes because the user navigated to another page from inside
 * it (e.g. clicking a router link). Without this, the dialog unmount's
 * guard pop races with — and cancels — the router navigation.
 */
export function skipDialogHistoryBack(): void {
	if (hasGuard) {
		suppressBackOnce = true;
	}
}

// ── Popstate handler (singleton) ────────────────────────────

function handlePopState(): void {
	// Important: PopStateEvent.state is the destination entry, not the
	// entry that was popped. So we cannot rely on e.state.__epilogGuard.
	// If we currently have dismissible UI registered, treat this popstate
	// as consuming our guard entry.
	if (!manualClose && callbacks.length === 0) {
		hasGuard = false;
		return;
	}

	hasGuard = false;

	if (manualClose) {
		manualClose = false;
		// If dialogs remain after a manual close, restore the guard.
		if (callbacks.length > 0) {
			hasGuard = true;
			history.pushState({ __epilogGuard: true }, "");
		}
		return;
	}

	// Hardware back button pressed — dismiss top layer.

	// 1. Keyboard focus → blur first.
	if (isInputFocused()) {
		blurActiveInput();
		if (callbacks.length > 0) {
			hasGuard = true;
			history.pushState({ __epilogGuard: true }, "");
		}
		return;
	}

	// 2. Dialog → close it.
	const entry = callbacks.pop();
	if (entry) {
		entry.close();
		// If more dialogs remain, push a new guard for them.
		if (callbacks.length > 0) {
			hasGuard = true;
			history.pushState({ __epilogGuard: true }, "");
		}
	}
}

if (globalThis.window && !hasInstalledBackHandler) {
	globalThis.window.addEventListener("popstate", handlePopState);
	hasInstalledBackHandler = true;
}

// ═══════════════════════════════════════════════════════════════
// Hook
// ═══════════════════════════════════════════════════════════════

/**
 * Intercepts the mobile hardware back button to close a dialog/sheet
 * instead of navigating to the previous page.
 *
 * Priority on back press:
 *   1. If an input is focused → blur it (closes keyboard)
 *   2. If a dialog is open     → close the topmost one
 *   3. If nothing remains      → allow normal navigation
 *
 * Multiple dialogs are stacked — each back press dismisses one layer.
 */
export function useDialogHistory(
	open: boolean,
	onClose: () => void,
	_id: string,
) {
	const onCloseRef = useRef(onClose);
	const wasOpenRef = useRef(false);
	const callbackIdRef = useRef<number | null>(null);

	onCloseRef.current = onClose; // Sync open/close with the global callback stack
	useEffect(() => {
		if (open && !wasOpenRef.current) {
			wasOpenRef.current = true;
			callbackIdRef.current = addCallback(() => {
				if (wasOpenRef.current) {
					wasOpenRef.current = false;
					callbackIdRef.current = null;
					onCloseRef.current();
				}
			});
		} else if (!open && wasOpenRef.current) {
			wasOpenRef.current = false;
			const id = callbackIdRef.current;
			if (id !== null) {
				callbackIdRef.current = null;
				removeCallback(id);
			}
		}

		return () => {
			if (wasOpenRef.current) {
				wasOpenRef.current = false;
				const id = callbackIdRef.current;
				if (id !== null) {
					callbackIdRef.current = null;
					removeCallback(id);
				}
			}
		};
	}, [open]);
}
