import { HouseIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { defaultMediaFilters } from "@/lib/media-filters";
import { Button } from "./ui/button";

export default function DefaultNotFoundComponent() {
	return (
		<div className="flex min-h-[60vh] items-center justify-center px-4 py-8">
			<div className="w-full max-w-xl rounded-lg border border-border bg-card p-8 shadow-soft">
				<div className="mb-6 flex items-start gap-4">
					<div className="rounded-lg bg-muted p-3 text-muted-foreground">
						<MagnifyingGlassIcon className="size-6" />
					</div>
					<div className="space-y-2">
						<h1 className="font-heading text-xl font-medium tracking-tight">
							Page not found
						</h1>
						<p className="text-sm text-muted-foreground">
							We couldn&apos;t find the page you were looking for.
						</p>
					</div>
				</div>

				<div className="space-y-2">
					<p className="text-sm text-muted-foreground">
						It may have been moved, removed, or the link might be
						incorrect.
					</p>
				</div>

				<div className="mt-6 flex flex-wrap gap-3">
					<Link search={defaultMediaFilters} to="/">
						<Button className="gap-2" size="sm">
							<HouseIcon className="size-4" />
							Home
						</Button>
					</Link>
				</div>
			</div>
		</div>
	);
}
