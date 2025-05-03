import { d as derived, w as writable } from "./index2.js";
import "firebase/auth";
const isAuthenticated = writable(false);
const user = writable(null);
const loading = writable(true);
const authError = writable(null);
const isAdmin = derived(user, ($user) => {
  if (!$user) return false;
  return $user.email === "admin@example.com" || $user?.isAdmin === true;
});
export {
  authError as a,
  isAdmin as b,
  isAuthenticated as i,
  loading as l,
  user as u
};
//# sourceMappingURL=authStore.js.map
