import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import { useMutation } from "@tanstack/react-query";
import { Image } from "@unpic/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
	BottomSheetDialogContent,
	Dialog,
} from "@/components/bottom-sheet-dialog";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { MediaType } from "@/types";
import type { CalendarMovieEvent } from "@/types/calendar-movie-event";
import MediaTypeIcon from "./media-type-icon";
import { Button } from "./ui/button";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "./ui/select";

type Props = {
	event: CalendarMovieEvent | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

function formatMediaType(type: MediaType) {
	switch (type) {
		case "tv":
			return "TV";
		default:
			return type.charAt(0).toUpperCase() + type.slice(1);
	}
}

function parseEventDate(eventDate: string) {
	const year = Number(eventDate.slice(0, 4));
	const month = Number(eventDate.slice(4, 6)) - 1;
	const day = Number(eventDate.slice(6, 8));
	return new Date(year, month, day);
}

function formatDate(date: Date) {
	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	}).format(date);
}

function eventPhrase(type: MediaType, date: string): string {
	const verb = type === "book" || type === "manga" ? "Read" : "Watched";
	return `${verb} on ${date}`;
}

function getDaysInMonth(year: number, month: number) {
	return new Date(year, month, 0).getDate();
}

const months = [
	{ value: null, label: "Month" },
	{ value: "1", label: "Jan" },
	{ value: "2", label: "Feb" },
	{ value: "3", label: "Mar" },
	{ value: "4", label: "Apr" },
	{ value: "5", label: "May" },
	{ value: "6", label: "Jun" },
	{ value: "7", label: "Jul" },
	{ value: "8", label: "Aug" },
	{ value: "9", label: "Sep" },
	{ value: "10", label: "Oct" },
	{ value: "11", label: "Nov" },
	{ value: "12", label: "Dec" },
];

export default function MovieCalendarEventDetailsDialog({
	event,
	open,
	onOpenChange,
}: Props) {
	const [selectedDay, setSelectedDay] = useState<string>("");
	const [selectedMonth, setSelectedMonth] = useState<string>("");
	const [selectedYear, setSelectedYear] = useState<string>("");
	const titleRef = useRef<HTMLHeadingElement>(null);

	const eventDate = useMemo(
		() => (event ? parseEventDate(event.eventDate) : undefined),
		[event],
	);

	useEffect(() => {
		if (!event) {
			setSelectedDay("");
			setSelectedMonth("");
			setSelectedYear("");
			return;
		}

		const parsedDate = parseEventDate(event.eventDate);
		setSelectedDay(parsedDate.getDate().toString());
		setSelectedMonth((parsedDate.getMonth() + 1).toString());
		setSelectedYear(parsedDate.getFullYear().toString());
	}, [event]);

	const currentYear = new Date().getFullYear();
	const yearOptions = Array.from(
		{ length: currentYear - 2000 + 1 },
		(_, index) => ({
			value: (currentYear - index).toString(),
			label: (currentYear - index).toString(),
		}),
	);
	const selectedMonthNumber = Number(selectedMonth || "1");
	const selectedYearNumber = Number(selectedYear || currentYear);
	const dayOptions = Array.from(
		{
			length: getDaysInMonth(selectedYearNumber, selectedMonthNumber),
		},
		(_, index) => {
			const day = (index + 1).toString();
			return {
				value: day,
				label: day.padStart(2, "0"),
			};
		},
	);

	const updateEventDateMutation = useMutation({
		mutationFn: useConvexMutation(api.movieEvents.updateEventDate),
		onMutate: () => {
			toast.loading("Updating event date...");
		},
		onSuccess: (response: string) => {
			toast.dismiss();

			if (response === "Already added") {
				toast.error("Movie already added for that day");
				return;
			}

			if (response === "No changes") {
				toast.info("No changes");
				return;
			}

			onOpenChange(false);
			toast.success(response);
		},
		onError: () => {
			toast.dismiss();
			toast.error("Something went wrong!");
		},
	});

	const deleteEventMutation = useMutation({
		mutationFn: useConvexMutation(api.movieEvents.remove),
		onMutate: () => {
			toast.loading("Deleting event...");
		},
		onSuccess: (response: string) => {
			toast.dismiss();
			onOpenChange(false);
			toast.success(response);
		},
		onError: () => {
			toast.dismiss();
			toast.error("Something went wrong!");
		},
	});

	if (!event) {
		return null;
	}

	const mediaType = event.type;
	const isLoading =
		updateEventDateMutation.isPending || deleteEventMutation.isPending;
	const formattedEventDate = eventDate
		? eventPhrase(mediaType, formatDate(eventDate))
		: "";

	const hasDateChanged =
		!!selectedDay &&
		!!selectedMonth &&
		!!selectedYear &&
		`${selectedYear}${selectedMonth.padStart(2, "0")}${selectedDay.padStart(2, "0")}` !==
			event.eventDate;

	return (
		<Dialog
			open={open}
			onOpenChange={(nextOpen) => {
				onOpenChange(nextOpen);
				if (nextOpen) {
					const parsedDate = parseEventDate(event.eventDate);
					setSelectedDay(parsedDate.getDate().toString());
					setSelectedMonth((parsedDate.getMonth() + 1).toString());
					setSelectedYear(parsedDate.getFullYear().toString());
				}
			}}
		>
			<BottomSheetDialogContent
				className="p-6 sm:p-6"
				initialFocus={titleRef}
				showCloseButton
			>
				<DialogHeader className="relative z-10 flex-shrink-0">
					<DialogTitle
						ref={titleRef}
						className="font-heading text-xl leading-tight font-normal tracking-tight text-foreground"
						tabIndex={-1}
					>
						{event.name || "Untitled"}
					</DialogTitle>
				</DialogHeader>

				<div className="relative z-10 flex flex-col gap-6 overflow-y-auto">
					{/* Media summary */}
					<div className="flex gap-4">
						<div className="h-[140px] w-24 flex-shrink-0 overflow-hidden rounded-lg bg-secondary shadow-soft ring-1 ring-border sm:h-[120px] sm:w-20">
							{event.image ? (
								<Image
									alt={event.name || "Media poster"}
									className="h-full w-full object-cover"
									height={120}
									src={event.image}
									width={80}
								/>
							) : (
								<div className="flex h-full w-full items-center justify-center">
									<MediaTypeIcon
										className="size-5 text-muted-foreground/50"
										type={mediaType}
									/>
								</div>
							)}
						</div>

						<div className="min-w-0 flex-1 space-y-2 pt-1">
							<p className="text-sm font-medium text-foreground">
								{formatMediaType(mediaType)}
								{event.releaseYear ? (
									<span className="text-muted-foreground tabular-nums">
										{" · "}
										{event.releaseYear}
									</span>
								) : null}
							</p>

							<p className="pt-1 text-xs text-muted-foreground/70">
								{formattedEventDate}
							</p>
						</div>
					</div>

					{/* Date watched field */}
					<div className="space-y-3">
						<label className="section-label block">
							Date watched
						</label>
						<div className="grid grid-cols-3 gap-2">
							<Select
								items={[
									{ value: null, label: "Day" },
									...dayOptions,
								]}
								value={selectedDay}
								onValueChange={(value) =>
									setSelectedDay(value ?? "")
								}
							>
								<SelectTrigger className="w-full">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectLabel>Day</SelectLabel>
										{dayOptions.map((day) => (
											<SelectItem
												key={day.value}
												value={day.value}
											>
												{day.label}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
							<Select
								items={months}
								value={selectedMonth}
								onValueChange={(value) => {
									setSelectedMonth(value ?? "");
									const daysInTargetMonth = getDaysInMonth(
										selectedYearNumber,
										Number(value ?? "1"),
									);

									if (
										Number(selectedDay) > daysInTargetMonth
									) {
										setSelectedDay(
											daysInTargetMonth.toString(),
										);
									}
								}}
							>
								<SelectTrigger className="w-full">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectLabel>Month</SelectLabel>
										{months
											.filter(
												(monthOption) =>
													monthOption.value !== null,
											)
											.map((monthOption) => (
												<SelectItem
													key={monthOption.value}
													value={monthOption.value}
												>
													{monthOption.label}
												</SelectItem>
											))}
									</SelectGroup>
								</SelectContent>
							</Select>
							<Select
								items={[
									{ value: null, label: "Year" },
									...yearOptions,
								]}
								value={selectedYear}
								onValueChange={(value) => {
									setSelectedYear(value ?? "");
									const daysInTargetMonth = getDaysInMonth(
										Number(value ?? currentYear.toString()),
										selectedMonthNumber,
									);

									if (
										Number(selectedDay) > daysInTargetMonth
									) {
										setSelectedDay(
											daysInTargetMonth.toString(),
										);
									}
								}}
							>
								<SelectTrigger className="w-full">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectLabel>Year</SelectLabel>
										{yearOptions.map((yearOption) => (
											<SelectItem
												key={yearOption.value}
												value={yearOption.value}
											>
												{yearOption.label}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* Footer actions */}
					<div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
						<Button
							disabled={isLoading}
							onClick={() =>
								deleteEventMutation.mutate({
									movieEventId: event.movieEventId,
								})
							}
							size="sm"
							variant="destructive"
						>
							Delete event
						</Button>

						<div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
							<Button
								disabled={isLoading}
								onClick={() => onOpenChange(false)}
								size="sm"
								variant="outline"
							>
								Cancel
							</Button>
							<Button
								disabled={isLoading || !hasDateChanged}
								onClick={() => {
									if (
										!selectedDay ||
										!selectedMonth ||
										!selectedYear
									) {
										return;
									}

									updateEventDateMutation.mutate({
										movieEventId: event.movieEventId,
										eventDate: `${selectedYear}${selectedMonth.padStart(2, "0")}${selectedDay.padStart(2, "0")}`,
									});
								}}
								size="sm"
							>
								Update date
							</Button>
						</div>
					</div>
				</div>
			</BottomSheetDialogContent>
		</Dialog>
	);
}
