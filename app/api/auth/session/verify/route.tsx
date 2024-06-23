import { getAuth } from "firebase-admin/auth";
import { app } from "@/lib/server/firebase";
import { jwtDecode } from "jwt-decode";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  let sessionCookie = request.cookies.get("app.at");

  if (!sessionCookie) return Response.json({}, { status: 401 });

  try {
    const jwtPayload = jwtDecode(sessionCookie.value);
    const expiration = jwtPayload.exp;
    if (!expiration) return Response.json({}, { status: 401 });

    // Check if the token has expired
    const isExpired = expiration * 1000 < Date.now(); // Convert to milliseconds

    if (isExpired) return Response.json({}, { status: 401 });

    const decodedClaims = await getAuth(app).verifySessionCookie(
      sessionCookie.value,
      true
    );
    return Response.json({ decodedClaims }, { status: 200 });
  } catch (error) {
    // Handle potential errors during JWT decoding
    console.error("Error decoding JWT:", error);
    return Response.json({}, { status: 401 });
  }
}
