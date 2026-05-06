// src/proxy.ts (renamed from middleware.ts)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Change from "middleware" to "proxy"
export function proxy(request: NextRequest) {
    // Your existing logic stays exactly the same
    const requestHeaders = new Headers(request.headers);

    const forwardedHost = requestHeaders.get('x-forwarded-host');
    const origin = requestHeaders.get('origin');

    if (forwardedHost === 'next_js_app' && origin) {
        const originHost = origin.replace(/^https?:\/\//, '');
        requestHeaders.set('x-forwarded-host', originHost);
    }

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}

export const config = {
    matcher: '/:path*',
};
