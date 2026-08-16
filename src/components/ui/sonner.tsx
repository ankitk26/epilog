import {
	CheckCircleIcon,
	InfoIcon,
	WarningIcon,
	XCircleIcon,
	SpinnerIcon,
} from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import { type CSSProperties } from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

type SonnerStyle = CSSProperties & {
	"--normal-bg": string;
	"--normal-text": string;
	"--normal-border": string;
	"--border-radius": string;
};

const Toaster = ({ ...props }: ToasterProps) => {
	const { theme } = useTheme();
	const toasterTheme =
		theme === "light" || theme === "dark" || theme === "system"
			? theme
			: "system";
	const toasterStyle: SonnerStyle = {
		"--normal-bg": "var(--popover)",
		"--normal-text": "var(--popover-foreground)",
		"--normal-border": "var(--border)",
		"--border-radius": "var(--radius)",
	};

	return (
		<Sonner
			theme={toasterTheme}
			className="toaster group"
			icons={{
				success: <CheckCircleIcon className="size-4" />,
				info: <InfoIcon className="size-4" />,
				warning: <WarningIcon className="size-4" />,
				error: <XCircleIcon className="size-4" />,
				loading: <SpinnerIcon className="size-4 animate-spin" />,
			}}
			style={toasterStyle}
			toastOptions={{
				classNames: {
					toast: "cn-toast",
				},
			}}
			{...props}
		/>
	);
};

export { Toaster };
