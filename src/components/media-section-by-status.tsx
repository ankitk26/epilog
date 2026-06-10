import type { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import {
	CaretDownIcon,
	PencilSimpleIcon,
	PencilSimpleSlashIcon,
} from "@phosphor-icons/react";
import type { FunctionReturnType } from "convex/server";
import { useState } from "react";
import { useMediaFilters } from "@/hooks/use-media-filters";
import { cn } from "@/lib/utils";
import EmptyStateMessage from "./empty-state-message";
import IconByType from "./icon-by-type";
import ListCard from "./list-card";
import ListViewToolbar from "./list-view-toolbar";
import MediaCard from "./media-card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

type Props = {
	logs: FunctionReturnType<typeof api.logs.all>;
	section: {
		title: string;
		status: string;
	};
};

export default function MediaSectionByStatus(props: Props) {
	const { type: mediaType, view } = useMediaFilters();

	const [isCollapsed, setIsCollapsed] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [selectedLogIds, setSelectedLogIds] = useState<Set<Id<"logs">>>(
		new Set(),
	);

	// toggle selection of a single item
	const onToggleSelect = (id: Id<"logs">) => {
		setSelectedLogIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) {
				next.delete(id);
			} else {
				next.add(id);
			}
			return next;
		});
	};

	return (
		<div className="space-y-4">
			{/* Section title */}
			<div className="flex items-center justify-between space-y-1">
				<div className="flex items-center gap-3">
					{/* Collapse button */}
					{props.logs.length > 0 && (
						<Button
							className="size-7 rounded-lg border-border/60 transition-all hover:bg-accent/50"
							onClick={() =>
								setIsCollapsed((prevState) => !prevState)
							}
							size="icon"
							variant="outline"
						>
							<CaretDownIcon
								className={cn(
									"size-3.5 transition-transform duration-300",
									isCollapsed ? "-rotate-90" : "rotate-0",
								)}
								weight="bold"
							/>
						</Button>
					)}

					<h2
						className="text-lg font-semibold tracking-tight"
						style={{ fontFamily: "var(--font-heading)" }}
					>
						{props.section.title}
					</h2>
					<Badge
						className="rounded-full border-0 bg-secondary px-2.5 text-xs font-semibold text-secondary-foreground"
						variant="secondary"
					>
						{props.logs.length}
					</Badge>

					{/* Edit button */}
					{props.logs.length > 0 && (
						<Button
							className="size-7 rounded-lg border-border/60 transition-all hover:bg-accent/50"
							onClick={() => setIsEditing((prev) => !prev)}
							size="icon"
							variant="outline"
						>
							{isEditing ? (
								<PencilSimpleSlashIcon
									className="size-3.5"
									weight="bold"
								/>
							) : (
								<PencilSimpleIcon
									className="size-3.5"
									weight="bold"
								/>
							)}
						</Button>
					)}
				</div>
			</div>

			<div className="flex w-full justify-start">
				{isEditing && props.logs.length > 0 && (
					<ListViewToolbar
						isEditing={isEditing}
						logs={props.logs}
						sectionStatus={props.section.status}
						selectedLogIds={selectedLogIds}
						setIsEditing={setIsEditing}
						setSelectedLogIds={setSelectedLogIds}
					/>
				)}
			</div>

			{!isCollapsed && props.logs.length !== 0 && (
				<div
					className={
						view === "list"
							? "flex flex-col gap-3"
							: "grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] lg:gap-4"
					}
				>
					{props.logs.map((log) =>
						view === "list" ? (
							<ListCard
								key={log._id}
								log={log}
								onToggleSelect={onToggleSelect}
								selected={selectedLogIds.has(log._id)}
								showCheckbox={isEditing}
							/>
						) : (
							<MediaCard
								displayOnly
								key={log._id}
								id={log._id}
								media={{
									imageUrl: log.metadata.image,
									name: log.metadata.name || "NA",
									releaseYear: log.metadata.releaseYear,
									sourceId: log.metadata.sourceMediaId,
									type: log.metadata.type,
								}}
								onToggleSelect={onToggleSelect}
								selected={selectedLogIds.has(log._id)}
								showCheckbox={isEditing}
							/>
						),
					)}
				</div>
			)}

			{/* No data section */}
			{props.logs.length === 0 && (
				<div className="flex flex-col items-center justify-center space-y-4 rounded-xl border-2 border-dashed border-border/40 py-10 text-center">
					<div className="flex size-12 items-center justify-center rounded-xl bg-secondary/50">
						<IconByType
							className="size-6 text-muted-foreground/60"
							type={mediaType}
						/>
					</div>
					<p className="text-xs text-muted-foreground">
						<EmptyStateMessage />
					</p>
				</div>
			)}
		</div>
	);
}
