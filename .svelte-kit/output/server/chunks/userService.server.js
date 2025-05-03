import pkg from "pg";
import { d as private_env } from "./shared-server.js";
const { Pool } = pkg;
const pool = new Pool({
  connectionString: private_env.DATABASE_URL
});
(private_env.VITE_ADMIN_EMAILS || "").split(",").map((email) => email.trim());
async function getAllUsers() {
  try {
    const result = await pool.query("SELECT * FROM users");
    return result.rows;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}
export {
  getAllUsers as g,
  pool as p
};
//# sourceMappingURL=userService.server.js.map
