import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  try {
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    // Initialize Supabase client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // Get authenticated user and claims
    const { data: claimsData, error: claimsError } =
      await supabase.auth.getClaims();

    // Check for admin role
    const isAdmin = claimsData?.claims?.user_role === "admin";

    // Handle route access and redirects
    if (request.nextUrl.pathname.startsWith("/admin") && !isAdmin) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (request.nextUrl.pathname === "/" && isAdmin) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    return response;
  } catch (e) {
    // Fallback for when Supabase client cannot be created
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
