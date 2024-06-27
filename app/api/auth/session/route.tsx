import { getAuth } from "firebase-admin/auth";
import { cookies } from "next/headers";
import { app } from "@/lib/server/firebase";
import { jwtDecode } from "jwt-decode";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const data = await request.json();
  const { idToken } = data;

  if (!idToken)
    return Response.json({ error: "Missing idToken" }, { status: 401 });

  const cookieStore = cookies();

  // Set session expiration to 1 day
  const expiresIn = 86400000 * 1;

  // Create the session cookie. This will also verify the ID token in the process.
  // The session cookie will have the same claims as the ID token.
  // To only allow session cookie setting on recent sign-in, auth_time in ID token
  // can be checked to ensure user was recently signed in before creating a session cookie.

  try {
    await getAuth(app).verifyIdToken(idToken, true);
    const sessionCookie = await getAuth(app).createSessionCookie(idToken, {
      expiresIn,
    });
    cookieStore.set("app.at", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: expiresIn,
    });

    cookieStore.set("app.idt", idToken, {
      sameSite: "lax",
      path: "/",
      maxAge: expiresIn,
    });

    // Set the expiration time in a cookie so we can check client side
    const jwtPalyoad = jwtDecode(sessionCookie);
    const expiration = jwtPalyoad.exp;

    if (expiration) {
      cookieStore.set("app.at_exp", expiration.toString(), {
        sameSite: "lax",
        path: "/",
        maxAge: expiresIn,
      });
    }
    return Response.json({ success: true });
  } catch (error: any) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 401 });
  }
}
