import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Clone headers so we can modify them
    const requestHeaders = new Headers(request.headers);

    // Fix the x-forwarded-host header
    const forwardedHost = requestHeaders.get('x-forwarded-host');
    const host = requestHeaders.get('host');
    const origin = requestHeaders.get('origin');

    // If x-forwarded-host is incorrect, replace it
    if (forwardedHost === 'next_js_app' && origin) {
        // Extract hostname from origin (e.g., https://awesome.atriko.dev -> awesome.atriko.dev)
        const originHost = origin.replace(/^https?:\/\//, '');
        requestHeaders.set('x-forwarded-host', originHost);
        console.log(`Fixed x-forwarded-host: ${forwardedHost} -> ${originHost}`);
    }

    // Also ensure x-forwarded-host matches host if origin is not available
    if (forwardedHost === 'next_js_app' && host && !origin) {
        requestHeaders.set('x-forwarded-host', host);
    }

    // Return response with fixed headers
    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}

// Apply middleware to all routes
export const config = {
    matcher: '/:path*',
};
