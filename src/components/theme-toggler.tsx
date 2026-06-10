import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();

	const toggleTheme = () => {
		setTheme(theme === "light" ? "dark" : "light");
	};

	return (
		<Button
			className="size-9 rounded-full border-border/60 transition-all duration-300 hover:border-ring/50 hover:bg-accent/50"
			onClick={toggleTheme}
			size="icon"
			variant="outline"
		>
			<SunIcon
				className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all duration-500 dark:scale-0 dark:-rotate-90"
				weight="bold"
			/>
			<MoonIcon
				className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all duration-500 dark:scale-100 dark:rotate-0"
				weight="bold"
			/>
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
}
