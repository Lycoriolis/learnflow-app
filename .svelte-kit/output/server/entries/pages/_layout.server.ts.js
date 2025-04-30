import { s as setupCsrfToken } from "../../chunks/csrf.server.js";
if (typeof window !== "undefined") {
  throw new Error("layout.server.ts should only be imported on the server!");
}
const load = async ({ cookies }) => {
  const csrfToken = setupCsrfToken(cookies);
  return {
    csrfToken
  };
};
export {
  load
};
