import { e as error } from "./index2.js";
import { s as setupCsrfToken, C as CSRF_HEADER, v as validateCsrfToken } from "./csrf.server.js";
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
const handle = async ({ event, resolve }) => {
  if (event.url.pathname.startsWith("/api")) {
    return csrfProtect({ event, resolve });
  }
  return resolve(event);
};
export {
  handle
};
