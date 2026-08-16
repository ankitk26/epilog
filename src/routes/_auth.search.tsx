import { ArrowLeftIcon } from "@phosphor-icons/react";
import {
	createFileRoute,
	useNavigate,
	useSearch,
} from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { useEffect, useState } from "react";
import { z } from "zod";
import SearchMediaTypeTabs from "@/components/search-media-type-tabs";
import SearchQueryInput from "@/components/search-query-input";
import SearchResultsPanel from "@/components/search-results-panel";
import { Button } from "@/components/ui/button";
import { defaultMediaFilters } from "@/lib/media-filters";
import { mediaTypes, type MediaType } from "@/types";

const searchPageSearchValidator = zodValidator({
	schema: z.object({
		q: z
			.string()
			.optional()
			.catch("")
			.transform((value) => value ?? ""),
		type: z
			.enum(mediaTypes)
			.optional()
			.catch(defaultMediaFilters.type)
			.transform((value) => value ?? defaultMediaFilters.type),
	}),
	input: "input",
	output: "output",
});

export const Route = createFileRoute("/_auth/search")({
	validateSearch: searchPageSearchValidator,
	component: SearchPage,
});

function SearchPage() {
	const navigate = useNavigate();
	const { q: queryParam, type: typeParam } = useSearch({
		from: "/_auth/search",
	});
	const [query, setQuery] = useState(queryParam);
	const [submittedQuery, setSubmittedQuery] = useState(queryParam);
	const [mediaType, setMediaType] = useState<MediaType>(typeParam);

	useEffect(() => {
		setQuery(queryParam);
		setSubmittedQuery(queryParam);
	}, [queryParam]);

	useEffect(() => {
		setMediaType(typeParam);
	}, [typeParam]);

	const handleSubmit = () => {
		const nextQuery = query.trim();
		setSubmittedQuery(nextQuery);
		void navigate({
			to: "/search",
			search: { q: nextQuery, type: mediaType },
		});
	};

	const handleMediaTypeChange = (nextType: MediaType) => {
		setMediaType(nextType);
		void navigate({
			to: "/search",
			search: { q: submittedQuery, type: nextType },
		});
	};

	return (
		<div className="animate-reveal-fade">
			<section className="max-w-5xl space-y-6 lg:space-y-8">
				<div className="w-full space-y-4">
					<div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
						<div className="flex items-center gap-2">
							<Button
								aria-label="Back to library"
								className="text-muted-foreground"
								onClick={() =>
									void navigate({
										to: "/",
										search: {
											...defaultMediaFilters,
											type: mediaType,
										},
									})
								}
								size="icon-xs"
								variant="outline"
							>
								<ArrowLeftIcon />
							</Button>
							<p className="section-label">Search the catalog</p>
						</div>
						<SearchMediaTypeTabs
							onChange={handleMediaTypeChange}
							value={mediaType}
						/>
					</div>
					<SearchQueryInput
						autoFocus
						onChange={setQuery}
						onSubmit={handleSubmit}
						value={query}
					/>
				</div>

				<SearchResultsPanel query={submittedQuery} type={mediaType} />
			</section>
		</div>
	);
}
