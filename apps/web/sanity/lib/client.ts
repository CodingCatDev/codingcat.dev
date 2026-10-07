import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId, studioUrl } from "@/sanity/lib/api";

export const client = createClient({
	projectId,
	dataset,
	apiVersion,
	useCdn: true,
	stega: {
		studioUrl,
		// logger: console,
		// filter: (props) => {
		//   const type = props.sourcePath.at(0) as string;
		//   const block = props.sourcePath.at(-1) as string;
		//   // If it is content but not of specified types
		//   if (!["content"].includes(type) || ["public_id", "secure_url"].includes(block)) {
		//     return false;
		//   }
		//   return props.filterDefault(props);
		// },
	},
});
