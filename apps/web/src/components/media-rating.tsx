import { StarIcon } from "@phosphor-icons/react";
import type { KeyboardEvent, PointerEvent } from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
	value: number | null;
	onValueChange?: (value: number | null) => void;
	readOnly?: boolean;
	disabled?: boolean;
	size?: "sm" | "md";
	className?: string;
};

const MAX_RATING = 5;
const STEP = 0.5;

const starSizes = {
	sm: "size-3.5",
	md: "size-5",
} as const;

function clamp(value: number, min: number, max: number) {
	return Math.min(max, Math.max(min, value));
}

function StarGlyph({ fill, className }: { fill: number; className?: string }) {
	return (
		<span className={cn("relative inline-flex", className)}>
			<StarIcon className="size-full" weight="regular" />
			<span
				className="absolute inset-0 overflow-hidden"
				style={{ width: `${fill * 100}%` }}
			>
				<StarIcon className="size-full" weight="fill" />
			</span>
		</span>
	);
}

export default function MediaRating({
	value,
	onValueChange,
	readOnly,
	disabled,
	size = "md",
	className,
}: Props) {
	const [focusIndex, setFocusIndex] = useState(() =>
		value === null ? 0 : clamp(Math.ceil(value), 1, MAX_RATING) - 1,
	);
	const starSize = starSizes[size];

	if (readOnly) {
		return (
			<div
				aria-label={
					value === null ? undefined : `Rated ${value} out of 5`
				}
				className={cn("flex items-center gap-1", className)}
			>
				{Array.from({ length: MAX_RATING }, (_, index) => {
					const fill =
						value === null ? 0 : clamp(value - index, 0, 1);

					return (
						<span
							className={cn(
								"text-muted-foreground/40",
								fill > 0 && "text-primary",
							)}
							key={index}
						>
							<StarGlyph className={starSize} fill={fill} />
						</span>
					);
				})}
			</div>
		);
	}

	const handlePointerDown = (
		event: PointerEvent<HTMLButtonElement>,
		index: number,
	) => {
		if (disabled) return;

		const rect = event.currentTarget.getBoundingClientRect();
		const isLeftHalf = event.clientX - rect.left < rect.width / 2;
		const next = index + (isLeftHalf ? STEP : 1);

		setFocusIndex(index);
		// Clicking the active rating clears it.
		onValueChange?.(value === next ? null : next);
	};

	const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		if (disabled) return;

		const current = value ?? 0;
		let next: number | null = null;

		switch (event.key) {
			case "ArrowRight":
			case "ArrowUp":
				next = clamp(current + STEP, 0, MAX_RATING);
				break;
			case "ArrowLeft":
			case "ArrowDown":
				next = clamp(current - STEP, 0, MAX_RATING);
				break;
			case "Home":
				next = STEP;
				break;
			case "End":
				next = MAX_RATING;
				break;
			default:
				return;
		}

		event.preventDefault();
		setFocusIndex(clamp(Math.ceil(next) - 1, 0, MAX_RATING - 1));
		onValueChange?.(next === 0 ? null : next);
	};

	return (
		<div
			aria-label="Rating"
			className={cn("flex items-center gap-1", className)}
			onKeyDown={handleKeyDown}
			role="radiogroup"
		>
			{Array.from({ length: MAX_RATING }, (_, index) => {
				const fill = value === null ? 0 : clamp(value - index, 0, 1);
				const isChecked =
					value !== null && index === Math.ceil(value) - 1;

				return (
					<button
						aria-checked={isChecked}
						aria-label={`${index + 1} star${index === 0 ? "" : "s"}`}
						className="cursor-pointer disabled:cursor-default disabled:opacity-50"
						disabled={disabled}
						key={index}
						onFocus={() => setFocusIndex(index)}
						onPointerDown={(event) =>
							handlePointerDown(event, index)
						}
						role="radio"
						tabIndex={focusIndex === index ? 0 : -1}
						type="button"
					>
						<span
							className={cn(
								"text-muted-foreground/40",
								fill > 0 && "text-primary",
							)}
						>
							<StarGlyph className={starSize} fill={fill} />
						</span>
					</button>
				);
			})}
		</div>
	);
}
