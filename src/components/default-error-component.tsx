import { HouseIcon, VideoCameraSlashIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { defaultMediaFilters } from "@/lib/media-filters";
import { Button } from "./ui/button";

export default function DefaultErrorComponent() {
	return (
		<div className="flex min-h-[60vh] items-center justify-center px-4 py-8">
			<div className="w-full max-w-xl rounded-2xl border bg-card p-6 shadow-sm">
				<div className="mb-6 flex items-start gap-4">
					<div className="rounded-2xl bg-destructive/10 p-3 text-destructive">
						<VideoCameraSlashIcon className="size-6" />
					</div>
					<div className="space-y-2">
						<h1 className="text-xl font-semibold tracking-tight">
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

				<div className="mt-6 flex flex-wrap gap-3">
					<Link search={defaultMediaFilters} to="/">
						<Button className="gap-2" size="sm">
							<HouseIcon className="size-4" />
							Home
						</Button>
					</Link>
					<Button
						onClick={() => window.location.reload()}
						size="sm"
						variant="outline"
					>
						Refresh page
					</Button>
				</div>
			</div>
		</div>
	);
}
