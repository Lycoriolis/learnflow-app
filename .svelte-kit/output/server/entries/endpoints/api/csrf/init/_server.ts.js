import "../../../../../chunks/index2.js";
import { s as setupCsrfToken, C as CSRF_HEADER } from "../../../../../chunks/csrf.server.js";
if (typeof window !== "undefined") {
  throw new Error("This endpoint should only be imported on the server!");
}
const GET = async ({ cookies }) => {
  const token = setupCsrfToken(cookies);
  return new Response(JSON.stringify({ token }), {
    status: 200,
    headers: {
      [CSRF_HEADER]: token
    }
  });
};
export {
  GET
};
