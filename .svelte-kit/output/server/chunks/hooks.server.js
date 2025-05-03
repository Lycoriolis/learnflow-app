import { e as error } from "./index.js";
import { s as setupCsrfToken, C as CSRF_HEADER, v as validateCsrfToken } from "./csrf.server.js";
import { b as adminAuth } from "./firebaseAdmin.js";
function sequence(...handlers) {
  const length = handlers.length;
  if (!length) return ({ event, resolve }) => resolve(event);
  return ({ event, resolve }) => {
    return apply_handle(0, event, {});
    function apply_handle(i, event2, parent_options) {
      const handle2 = handlers[i];
      return handle2({
        event: event2,
        resolve: (event3, options) => {
          const transformPageChunk = async ({ html, done }) => {
            if (options?.transformPageChunk) {
              html = await options.transformPageChunk({ html, done }) ?? "";
            }
            if (parent_options?.transformPageChunk) {
              html = await parent_options.transformPageChunk({ html, done }) ?? "";
            }
            return html;
          };
          const filterSerializedResponseHeaders = parent_options?.filterSerializedResponseHeaders ?? options?.filterSerializedResponseHeaders;
          const preload = parent_options?.preload ?? options?.preload;
          return i < length - 1 ? apply_handle(i + 1, event3, {
            transformPageChunk,
            filterSerializedResponseHeaders,
            preload
          }) : resolve(event3, { transformPageChunk, filterSerializedResponseHeaders, preload });
        }
      });
    }
  };
}
if (typeof window !== "undefined") {
  throw new Error("csrfMiddleware.ts should only be imported on the server!");
}
const csrfProtect = async ({ event, resolve }) => {
  if (event.request.method === "GET") {
    const newToken2 = setupCsrfToken(event.cookies);
    const response2 = await resolve(event);
    const headers2 = new Headers(response2.headers);
    headers2.set(CSRF_HEADER, newToken2);
    return new Response(response2.body, {
      status: response2.status,
      statusText: response2.statusText,
      headers: headers2
    });
  }
  const headerToken = event.request.headers.get(CSRF_HEADER);
  if (!validateCsrfToken(event.cookies, headerToken)) {
    throw error(403, {
      message: "CSRF token validation failed"
    });
  }
  const newToken = setupCsrfToken(event.cookies);
  const response = await resolve(event);
  const headers = new Headers(response.headers);
  headers.set(CSRF_HEADER, newToken);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
};
const authMiddleware = async ({ event, resolve }) => {
  const authHeader = event.request.headers.get("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    try {
      const decodedToken = await adminAuth.verifyIdToken(token);
      event.locals.user = decodedToken;
      console.log(`User authenticated: ${decodedToken.uid}`);
    } catch (error2) {
      console.error("Token verification failed:", error2);
    }
  }
  return resolve(event);
};
const requireAuth = async ({ event, resolve }) => {
  await authMiddleware({ event, resolve: (e) => Promise.resolve(new Response()) });
  if (!event.locals.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  return resolve(event);
};
const authRequiredPaths = [
  "/api/score",
  "/api/recommendations",
  "/api/activities"
];
const handle = async ({ event, resolve }) => {
  if (event.url.pathname.startsWith("/api")) {
    const path = event.url.pathname;
    if (authRequiredPaths.some((route) => path.startsWith(route))) {
      return sequence(csrfProtect, requireAuth)({ event, resolve });
    }
    return sequence(csrfProtect, authMiddleware)({ event, resolve });
  }
  return resolve(event);
};
export {
  handle
};
//# sourceMappingURL=hooks.server.js.map
