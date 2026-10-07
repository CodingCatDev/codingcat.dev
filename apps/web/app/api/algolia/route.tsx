import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { algoliasearch } from "algoliasearch";

const secret = process.env.PRIVATE_ALGOLIA_WEBOOK_SECRET;
const algoliaAdminApiKey = process.env.PRIVATE_ALGOLIA_ADMIN_API_KEY;
const algoliaAppId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
const algoliaIndex = process.env.NEXT_PUBLIC_ALGOLIA_INDEX;

if (!algoliaAdminApiKey) {
	throw "Missing PRIVATE_ALGOLIA_ADMIN_API_KEY";
}
if (!algoliaAppId) {
	throw "Missing NEXT_PUBLIC_ALGOLIA_APP_ID";
}
if (!algoliaIndex) {
	throw "Missing NEXT_PUBLIC_ALGOLIA_INDEX";
}

const client = algoliasearch(algoliaAppId, algoliaAdminApiKey);

function toAlgoliaObject(sanityDoc: any) {
	const doc = { ...sanityDoc };
	// biome-ignore lint/performance/noDelete: <explanation>
	delete doc.content;

	return (
		sanityDoc?.content
			// loop through each block
			?.map((block: any, i: number) => {
				// if it's not a text block with children,
				// return nothing
				if (block._type !== "block" || !block.children) {
					return {
						...doc,
						objectID: `${doc._id}-${i}`,
					};
				}
				// loop through the children spans, and join the
				// text strings
				return {
					...doc,
					objectID: `${doc._id}-${i}`,
					content: block.children.map((child: any) => child.text).join(""),
				};
			})
	);
}

export async function POST(request: Request) {
	if (!secret) {
		return Response.json(
			{ success: false, error: "Missing Secret PRIVATE_ALGOLIA_WEBOOK_SECRET" },
			{ status: 400 },
		);
	}

	const signature = request.headers.get(SIGNATURE_HEADER_NAME);

	if (!signature) {
		return Response.json(
			{ success: false, error: "Missing Signature Header" },
			{ status: 401 },
		);
	}

	const body = await request.text();
	if (!(await isValidSignature(body, signature, secret))) {
		return Response.json(
			{ success: false, message: "Invalid signature" },
			{ status: 400 },
		);
	}

	const sanityDoc = JSON.parse(body);

	// From Sanity Webhook projection
	// {
	//   ...,
	//   "objectID":_id,
	//   "slug": slug.current,
	//   "guest": null,
	//   "spotify": null,
	//   "created": select(before() == null && after() != null => _id),
	//   "deleted": select(before() != null && after() == null => _id),
	//   "updated": select(before() != null && after() != null => _id),
	// }

	const created = sanityDoc.created;
	const deleted = sanityDoc.deleted;
	const updated = sanityDoc.updated;

	// biome-ignore lint/performance/noDelete: <explanation>
	delete sanityDoc.created;
	// biome-ignore lint/performance/noDelete: <explanation>
	delete sanityDoc.deleted;
	// biome-ignore lint/performance/noDelete: <explanation>
	delete sanityDoc.updated;

	const algoliaDoc = toAlgoliaObject(sanityDoc);

	try {
		if (created) {
			await client.saveObjects({
				indexName: algoliaIndex as string,
				objects: [algoliaDoc],
			});
		} else if (updated) {
			await client.saveObjects({
				indexName: algoliaIndex as string,
				objects: [algoliaDoc],
			});
		} else {
			await client.deleteObject({
				indexName: algoliaIndex as string,
				objectID: sanityDoc.objectID,
			});
		}
	} catch (e) {
		const error = JSON.stringify(e);
		console.error(error);
		Response.json({ success: false, error }, { status: 400 });
	}

	return Response.json({ success: true });
}
