import { HiOutlinePencilAlt } from "react-icons/hi";
import { defineType } from "sanity";

import contentType from "../partials/content";

export default defineType({
	...contentType,
	name: "post",
	title: "Post",
	icon: HiOutlinePencilAlt,
	type: "document",
	groups: [...(contentType.groups || [])],
	fields: [...contentType.fields],
});

