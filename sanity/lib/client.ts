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
      const type = props.sourcePath.at(0) as string;
      if (!["content"].includes(type)) {
        return false;
      } else {
        return props.filterDefault(props);
      }
    },
  },
});
