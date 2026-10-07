import type { APIRoute } from "astro";

export const prerender = false;

export const ALL: APIRoute = async () => {
	return Response.json(
		{
			migrated: true,
			message:
				"Content syndication to Dev.to is now natively handled by Sanity Functions via Blueprints (syndicate-content). Please disable or delete this legacy webhook in the Sanity Manage dashboard.",
		},
		{ status: 200 },
	);
};
