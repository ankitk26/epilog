import { HouseIcon, VideoCameraSlashIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { defaultMediaFilters } from "@/lib/media-filters";
import { Button } from "./ui/button";

export default function DefaultErrorComponent() {
	return (
		<div className="flex min-h-[60vh] items-center justify-center px-4 py-8">
			<div className="w-full max-w-xl rounded-xl border border-border/70 bg-card p-8 shadow-lg">
				<div className="mb-6 flex items-start gap-4">
					<div className="rounded-lg bg-destructive/10 p-3 text-destructive">
						<VideoCameraSlashIcon className="size-6" />
					</div>
					<div className="space-y-2">
						<h1 className="text-xl font-medium tracking-tight">
							Unexpected error
						</h1>
						<p className="text-sm text-muted-foreground">
							The app hit a problem and could not finish this
							request.
						</p>
					</div>
				</div>

				<div className="space-y-2">
					<p className="text-sm text-muted-foreground">
						You can head back home or refresh this page and try
						again.
					</p>
				</div>

				<div className="mt-6 flex flex-col gap-3 sm:flex-row">
					<Link
						className="w-full sm:w-auto"
						search={defaultMediaFilters}
						to="/"
					>
						<Button className="w-full gap-2 sm:w-auto">
							<HouseIcon className="size-4" />
							Home
						</Button>
					</Link>
					<Button
						className="w-full sm:w-auto"
						onClick={() => window.location.reload()}
						variant="outline"
					>
						Refresh page
					</Button>
				</div>
			</div>
		</div>
	);
}
