/**
 * This plugin contains the logic for setting up singletons (hiding them from global new-document creation and disabling duplicate).
 */

import { definePlugin } from "sanity";

export const singletonPlugin = definePlugin((types: string[]) => {
	return {
		name: "singletonPlugin",
		document: {
			// Hide Singletons (such as Settings) from global new document options
			newDocumentOptions: (prev, { creationContext }) => {
				if (creationContext.type === "global") {
					return prev.filter(
						(templateItem) => !types.includes(templateItem.templateId),
					);
				}

				return prev;
			},
			// Remove the "duplicate" action on Singletons
			actions: (prev, { schemaType }) => {
				if (types.includes(schemaType)) {
					return prev.filter(({ action }) => action !== "duplicate");
				}

				return prev;
			},
		},
	};
});
