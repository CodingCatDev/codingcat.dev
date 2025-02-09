import { type NextRequest, NextResponse } from "next/server";
import { publicURL } from "./lib/utils";

export const config = {
	matcher: ["/settings/:path*", "/dashboard", "/dashboard/:path*", "/login"],
};

export async function middleware(request: NextRequest) {
	const login = request.nextUrl.pathname.startsWith("/login");
	const sessionCookie = request.cookies.get("app.at");
	const sessionExpireCookie = request.cookies.get("app.at_exp");
	const tokenCookie = request.cookies.get("app.idt");
	const redirectTo = request.nextUrl.searchParams.get("redirectTo");

	const clearCookies = () => {
		console.debug("clearing cookies");
		// If sending to login, it could mean that cookies are off
		// so we will delete them all before redirect
		request.cookies.delete("app.at");
		request.cookies.delete("app.at_exp");
		request.cookies.delete("app.idt");
	};

	const sendToLogin = () => {
		console.log("sending to login");
		if (login) {
			clearCookies();
			return NextResponse.next();
		}
		return NextResponse.redirect(new URL("/login", request.url));
	};

	// If any cookies missing then go to login
	if (!sessionCookie || !sessionExpireCookie || !tokenCookie)
		return sendToLogin();

	// Call the authentication endpoint
	// TODO: Do we really need to verify if the JWT is not expired, should we check for
	// expiration and validity here of just the JWT and only call out to Firebase when needed?
	const responseAPI = await fetch(publicURL() + "/api/auth/session/verify", {
		headers: {
			Cookie: `app.at=${sessionCookie?.value}`,
		},
	});

	console.debug(responseAPI.status);

	//Return to /login if token is not authorized
	if (responseAPI.status !== 200 && !login) {
		clearCookies();
		return NextResponse.redirect(new URL("/login", request.url));
	}

	//Return to specified route
	if (responseAPI.status === 200 && login) {
		return redirectTo
			? NextResponse.redirect(new URL(redirectTo, request.url))
			: NextResponse.redirect(new URL("/dashboard", request.url));
	}

	console.debug("redirecting to:", redirectTo || request.nextUrl.pathname);
	return redirectTo
		? NextResponse.redirect(new URL(redirectTo, request.url))
		: NextResponse.next();
}
