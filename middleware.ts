import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
	let supabaseResponse = NextResponse.next({ request });

	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	if (!supabaseUrl || !supabaseAnonKey) {
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

	if (
		pathname === "/dashboard/login" ||
		pathname.startsWith("/dashboard/auth/")
	) {
		if (user) {
			const url = request.nextUrl.clone();
			url.pathname = "/dashboard";
			return NextResponse.redirect(url);
		}
		return supabaseResponse;
	}

	if (pathname.startsWith("/dashboard") && !user) {
		const url = request.nextUrl.clone();
		url.pathname = "/dashboard/login";
		return NextResponse.redirect(url);
	}

	return supabaseResponse;
}

export const config = {
	matcher: ["/dashboard/:path*"],
};
