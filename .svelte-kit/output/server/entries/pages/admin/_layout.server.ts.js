import { r as redirect } from "../../../chunks/index.js";
import { d as private_env } from "../../../chunks/shared-server.js";
const load = async ({ locals }) => {
  const user = locals.user;
  const ADMIN_EMAILS = (private_env.VITE_ADMIN_EMAILS || "").split(",").map((email) => email.trim());
  if (!user || !user.email || !ADMIN_EMAILS.includes(user.email)) {
    throw redirect(302, "/");
  }
  return {
    user
  };
};
export {
  load
};
//# sourceMappingURL=_layout.server.ts.js.map
