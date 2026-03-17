import { DocumentTextIcon } from "@sanity/icons";
import { defineType } from "sanity";

import contentType from "../partials/content";
import {
	socialPreviewFields,
	socialPreviewGroup,
} from "../partials/socialPreview";

export default defineType({
	...contentType,
	name: "page",
	title: "Page",
	icon: DocumentTextIcon,
	type: "document",
	groups: [...(contentType.groups || []), socialPreviewGroup],
	fields: [...contentType.fields, ...socialPreviewFields],
});
