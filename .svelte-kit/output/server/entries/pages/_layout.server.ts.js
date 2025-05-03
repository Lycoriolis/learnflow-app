import { s as setupCsrfToken } from "../../chunks/csrf.server.js";
const load = async ({ cookies }) => {
  const csrfToken = setupCsrfToken(cookies);
  return { csrfToken };
};
export {
  load
};
//# sourceMappingURL=_layout.server.ts.js.map
