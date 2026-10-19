import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { defineType } from "sanity";

import contentType from "../partials/content";

export default defineType({
	...contentType,
	name: "page",
	title: "Page",
	icon: DocumentTextIcon,
	type: "document",
	groups: [...(contentType.groups || [])],
	fields: [...contentType.fields],
});

