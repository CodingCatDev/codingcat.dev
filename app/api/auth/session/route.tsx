import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
	return Response.json({ error: "Not found" }, { status: 404 });
}