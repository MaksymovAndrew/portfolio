// liveness probe for the container: prerendered, so it needs nothing but a running server
export const dynamic = "force-static";

export const GET = (): Response => new Response("ok");
