import { w as writable } from "./index2.js";
function persistentStore(key, initialValue) {
  let initial = initialValue;
  const store = writable(initial);
  return store;
}
export {
  persistentStore as p
};
//# sourceMappingURL=persistentStore.js.map
