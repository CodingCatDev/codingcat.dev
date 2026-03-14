import { defineArrayMember, defineField, defineType } from "sanity";

const rowType = defineType({
	name: "row",
	type: "object",
	fields: [
		defineField({
			name: "cells",
			type: "array",
			of: [{ type: "string" }],
		}),
	],
});

const tableType = defineType({
	name: "table",
	type: "object",
	title: "Table",
	fields: [
		defineField({
			name: "rows",
			type: "array",
			of: [defineArrayMember({ type: "row" })],
		}),
	],
});

export default tableType;
export { rowType };
