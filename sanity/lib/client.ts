import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId, studioUrl } from "@/sanity/lib/api";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
  stega: {
    studioUrl,
    // logger: console,
    filter: (props) => {
      if (props.sourcePath.at(0) !== "content") {
        return false;
      } else {
        return props.filterDefault(props);
      }
    },
  },
});
