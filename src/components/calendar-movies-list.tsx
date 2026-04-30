import { convexQuery } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Image } from "@unpic/react";
import IconByType from "./icon-by-type";
import { ScrollArea } from "./ui/scroll-area";

export default function CalendarMoviesList() {
	const { data: logs } = useSuspenseQuery(convexQuery(api.logs.all, {}));

	return (
		<ScrollArea className="col-span-2 h-full">
			<div className="flex flex-col gap-1">
				{logs
					.filter((log) => log.metadata.type === "movie")
					.map((log) => {
						return (
							<div
								key={log._id}
								className="flex items-start gap-2 rounded-lg border p-2"
							>
								<div className="relative aspect-2/3 w-10 shrink-0 overflow-hidden">
									{log.metadata.image ? (
										<Image
											alt={log.metadata.name}
											className="h-full w-full object-cover object-top"
											height={120}
											width={80}
											src={log.metadata.image}
										/>
									) : (
										<div className="flex h-full w-full items-center justify-center bg-muted">
											<IconByType
												className="size-6 text-muted-foreground"
												type={log.metadata.type}
											/>
										</div>
									)}
								</div>
								<div className="min-w-0 flex-1">
									<h4 className="truncate text-xs font-medium">
										{log.metadata.name}
									</h4>
									{log.metadata.releaseYear && (
										<p className="text-xs text-muted-foreground">
											{log.metadata.releaseYear}
										</p>
									)}
								</div>
							</div>
						);
					})}
			</div>
		</ScrollArea>
	);
}
