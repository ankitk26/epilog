import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import { useMutation } from "@tanstack/react-query";
import { Image } from "@unpic/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { CalendarMovieEvent } from "@/types/calendar-movie-event";
import IconByType from "./icon-by-type";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
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

function parseEventDate(eventDate: string) {
	const year = Number(eventDate.slice(0, 4));
	const month = Number(eventDate.slice(4, 6)) - 1;
	const day = Number(eventDate.slice(6, 8));
	return new Date(year, month, day);
}

function formatDisplayDate(date: Date) {
	return `${date.getFullYear().toString().padStart(4, "0")}-${(
		date.getMonth() + 1
	)
		.toString()
		.padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
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

export default function MovieEventDetailsDialog({
	event,
	open,
	onOpenChange,
}: Props) {
	const [selectedDay, setSelectedDay] = useState<string>("");
	const [selectedMonth, setSelectedMonth] = useState<string>("");
	const [selectedYear, setSelectedYear] = useState<string>("");

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
			<DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Movie event</DialogTitle>
				</DialogHeader>
				<div className="flex items-start gap-3">
					<div className="relative aspect-2/3 w-24 shrink-0 overflow-hidden rounded-lg border">
						{event.image ? (
							<Image
								src={event.image}
								className="h-full w-full object-cover object-top"
								height={180}
								width={120}
								alt={event.name}
							/>
						) : (
							<div className="flex h-full w-full items-center justify-center bg-muted">
								<IconByType
									className="size-8 text-muted-foreground"
									type={event.type}
								/>
							</div>
						)}
					</div>
					<div className="min-w-0 space-y-1">
						<h3 className="text-sm font-medium">{event.name}</h3>
						{event.releaseYear && (
							<p className="text-xs text-muted-foreground">
								{event.releaseYear}
							</p>
						)}
						{eventDate && (
							<p className="text-xs text-muted-foreground">
								Current date: {formatDisplayDate(eventDate)}
							</p>
						)}
					</div>
				</div>
				<div className="space-y-2">
					<p className="text-xs font-medium">Update event date</p>
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

								if (Number(selectedDay) > daysInTargetMonth) {
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

								if (Number(selectedDay) > daysInTargetMonth) {
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
				<div className="flex items-center justify-between gap-2">
					<Button
						variant="destructive"
						onClick={() =>
							deleteEventMutation.mutate({
								movieEventId: event.movieEventId,
							})
						}
					>
						Delete event
					</Button>
					<Button
						disabled={
							!selectedDay || !selectedMonth || !selectedYear
						}
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
					>
						Update date
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
