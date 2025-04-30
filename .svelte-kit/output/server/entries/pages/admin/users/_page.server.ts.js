import { g as getAllUsers } from "../../../../chunks/userService.server.js";
const load = async () => {
  const users = await getAllUsers();
  return { users };
};
export {
  load
};
