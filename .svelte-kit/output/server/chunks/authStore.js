import { w as writable } from "./index3.js";
import "firebase/auth";
const isAuthenticated = writable(false);
const user = writable(null);
const loading = writable(true);
const authError = writable(null);
export {
  authError as a,
  isAuthenticated as i,
  loading as l,
  user as u
};
