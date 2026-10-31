import { defineAssetAspect, defineField } from "sanity";

/**
 * Sanity Media Library (`mlttp0BZbCpV`) `metadata` aspect definition.
 *
 * Captures both:
 * 1. Environment & folder governance (`environment`, `visibility`, `category`, `partnerSlug`, `docType`)
 *    so `production` and `dev` assets (and `public` vs `private-vault` uploads) are cleanly separated
 *    via both physical folders (`sanity.directory`) and GROQ filters (`options.mediaLibrary.filters`).
 * 2. Legacy `sanity-plugin-media` fields (`title`, `description`, `creditLine`, `altText`, `originalFilename`, `tags`)
 *    migrated by `scripts/migrate-media.ts --include-aspects`.
 */
export default defineAssetAspect({
	name: "metadata",
	title: "Metadata",
	type: "object",
	fields: [
		defineField({
			name: "environment",
			title: "Environment (Dataset)",
			type: "string",
			options: {
				list: [
					{ title: "Production", value: "production" },
					{ title: "Dev Sandbox", value: "dev" },
				],
			},
		}),
		defineField({
			name: "visibility",
			title: "Visibility Tier",
			type: "string",
			options: {
				list: [
					{ title: "Public Editorial / Brand Asset", value: "public" },
					{ title: "Private Studio Portal Vault", value: "private-vault" },
				],
			},
		}),
		defineField({
			name: "category",
			title: "Asset Category",
			type: "string",
			options: {
				list: [
					{ title: "Editorial (Courses, Podcasts, Blog)", value: "editorial" },
					{ title: "Guest Speaker Headshot", value: "guest" },
					{ title: "Sponsor Logo / Creative", value: "sponsor" },
					{ title: "Studio Portal Vault", value: "portal-vault" },
				],
			},
		}),
		defineField({
			name: "partnerSlug",
			title: "Guest / Partner Slug",
			type: "string",
		}),
		defineField({
			name: "docType",
			title: "Primary Referencing Document Type",
			type: "string",
		}),
		defineField({
			name: "title",
			title: "Title",
			type: "string",
		}),
		defineField({
			name: "description",
			title: "Description",
			type: "text",
		}),
		defineField({
			name: "creditLine",
			title: "Credit line",
			type: "string",
		}),
		defineField({
			name: "altText",
			title: "Alt text",
			type: "string",
		}),
		defineField({
			name: "originalFilename",
			title: "Original filename",
			type: "string",
		}),
		defineField({
			name: "tags",
			title: "Tags",
			type: "array",
			of: [{ type: "string" }],
		}),
	],
});
