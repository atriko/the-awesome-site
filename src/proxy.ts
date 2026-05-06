import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    // Clone headers so we can modify them
    const requestHeaders = new Headers(request.headers);

    // Fix the x-forwarded-host header
    const forwardedHost = requestHeaders.get("x-forwarded-host");
    const origin = requestHeaders.get("origin");

    // If x-forwarded-host is incorrect, replace it
    if (forwardedHost === "next_js_app" && origin) {
        const originHost = origin.replace(/^https?:\/\//, "");
        requestHeaders.set("x-forwarded-host", originHost);
    }

    // Also ensure x-forwarded-host matches host if origin is not available
    const host = requestHeaders.get("host");
    if (forwardedHost === "next_js_app" && host && !origin) {
        requestHeaders.set("x-forwarded-host", host);
    }

    // Return response with fixed headers
    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}

export const config = {
    matcher: "/:path*",
};
