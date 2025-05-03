import { d as private_env } from "./shared-server.js";
import crypto from "crypto";
const CSRF_HEADER = "X-CSRF-Token";
const CSRF_COOKIE = "csrf_token";
if (typeof window !== "undefined") {
  throw new Error("csrf.server.ts should only be imported on the server!");
}
const CSRF_SECRET = private_env.VITE_CSRF_SECRET || "default-csrf-secret-key-should-be-changed-in-production";
function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}
function setupCsrfToken(cookies) {
  const token = generateToken();
  cookies.set(CSRF_COOKIE, token, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24
    // 24 hours
  });
  return token;
}
function hashToken(token) {
  return crypto.createHmac("sha256", CSRF_SECRET).update(token).digest("hex");
}
function validateCsrfToken(cookies, headerToken) {
  if (!headerToken) return false;
  const cookieToken = cookies.get(CSRF_COOKIE);
  if (!cookieToken) return false;
  try {
    return crypto.timingSafeEqual(
      Buffer.from(hashToken(headerToken)),
      Buffer.from(hashToken(cookieToken))
    );
  } catch (error) {
    console.error("CSRF validation error:", error);
    return false;
  }
}
export {
  CSRF_HEADER as C,
  setupCsrfToken as s,
  validateCsrfToken as v
};
//# sourceMappingURL=csrf.server.js.map
