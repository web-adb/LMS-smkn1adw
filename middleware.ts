import { NextResponse, type NextRequest, type NextFetchEvent } from 'next/server'
import { authMiddleware } from "@clerk/nextjs";

const clerkAuthMiddleware = authMiddleware({
    publicRoutes: ['/api/uploadthing', '/api/webhook'],
    ignoredRoutes: ['/no-auth-in-this-route'],
});

export async function middleware(request: NextRequest, event: NextFetchEvent) {
    // Pertama, jalankan pengecekan referer API
    const url = request.nextUrl
    const { pathname } = url

    if (pathname.startsWith(`/api/`) && 
        !pathname.startsWith('/api/uploadthing') && 
        !pathname.startsWith('/api/webhook')) {
        
        if (!request.headers.get("referer")?.includes(process.env.NEXT_PUBLIC_APP_URL as string)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
    }

    // Kemudian jalankan middleware Clerk dengan kedua argumen
    return clerkAuthMiddleware(request, event);
}

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};