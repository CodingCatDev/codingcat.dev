import React, { Suspense } from "react";

import AlgoliaSearch from "@/components/algolia-search";
export default function Page() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<AlgoliaSearch />
		</Suspense>
	);
}
