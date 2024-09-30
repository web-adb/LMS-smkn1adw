import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
    // Routes that can be accessed while signed out
    publicRoutes: ['/api/uploadthing', '/api/webhook'], // Ensure webhook is accessible
    ignoredRoutes: ['/no-auth-in-this-route'], // Add other routes as needed
});

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
