import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	return Response.json({ error: "Not found" }, { status: 404 });
}