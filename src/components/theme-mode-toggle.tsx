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
			<SunIcon className="size-[1.1rem] scale-100 rotate-0 transition-all duration-300 dark:scale-0 dark:-rotate-90" />
			<MoonIcon className="absolute size-[1.1rem] scale-0 rotate-90 transition-all duration-300 dark:scale-100 dark:rotate-0" />
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
}
