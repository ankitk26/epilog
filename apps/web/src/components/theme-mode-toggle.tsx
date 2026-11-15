import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { useTheme } from "better-themes";
import { Button } from "@/components/ui/button";

export function ThemeModeToggle() {
	const { theme, setTheme } = useTheme();

	const toggleTheme = () => {
		setTheme(theme === "light" ? "dark" : "light");
	};

	return (
		<Button onClick={toggleTheme} size="icon" variant="outline">
			<SunIcon className="size-4 dark:hidden" />
			<MoonIcon className="absolute hidden size-4 dark:block" />
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
}
