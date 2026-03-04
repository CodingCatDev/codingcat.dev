import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
	let supabaseResponse = NextResponse.next({ request });

	// Support both NEXT_PUBLIC_ and non-prefixed env var names
	const supabaseUrl =
		process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
	const supabaseAnonKey =
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

	if (!supabaseUrl || !supabaseAnonKey) {
		// Auth not configured — block access to dashboard
		const url = request.nextUrl.clone();
		url.pathname = "/dashboard/login";
		if (request.nextUrl.pathname !== "/dashboard/login") {
			return NextResponse.redirect(url);
		}
		return supabaseResponse;
	}

	const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
		cookies: {
			getAll() {
				return request.cookies.getAll();
			},
			setAll(cookiesToSet) {
				cookiesToSet.forEach(({ name, value }) =>
					request.cookies.set(name, value),
				);
				supabaseResponse = NextResponse.next({ request });
				cookiesToSet.forEach(({ name, value, options }) =>
					supabaseResponse.cookies.set(name, value, options),
				);
			},
		},
	});

	const {
		data: { user },
	} = await supabase.auth.getUser();

	const { pathname } = request.nextUrl;

	// Allow login and auth callback pages without auth
	if (
		pathname === "/dashboard/login" ||
		pathname.startsWith("/dashboard/auth/")
	) {
		// If already logged in, redirect to dashboard
		if (user) {
			const url = request.nextUrl.clone();
			url.pathname = "/dashboard";
			return NextResponse.redirect(url);
		}
		return supabaseResponse;
	}

	// Protect all other /dashboard routes
	if (pathname.startsWith("/dashboard") && !user) {
		const url = request.nextUrl.clone();
		url.pathname = "/dashboard/login";
		return NextResponse.redirect(url);
	}

	return supabaseResponse;
}

export const config = {
	// ONLY match dashboard routes — never touch the main site
	matcher: ["/dashboard/:path*"],
};
