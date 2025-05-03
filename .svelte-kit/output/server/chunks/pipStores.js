import { w as writable } from "./index2.js";
import { p as persistentStore } from "./persistentStore.js";
const pipVisible = writable(false);
const todos = persistentStore("learnflow-todos", []);
const notepadContent = persistentStore("learnflow-notepad-content", "");
const focusSessions = persistentStore("learnflow-focus-sessions", []);
const exerciseSessions = persistentStore("learnflow-exercise-sessions", []);
const calcDisplay = writable("0");
const calcCurrentInput = writable("");
const calcOperator = writable(null);
const calcPreviousValue = writable(null);
const calcWaitingForSecondOperand = writable(false);
export {
  calcWaitingForSecondOperand as a,
  calcCurrentInput as b,
  calcDisplay as c,
  calcPreviousValue as d,
  exerciseSessions as e,
  focusSessions as f,
  calcOperator as g,
  notepadContent as n,
  pipVisible as p,
  todos as t
};
//# sourceMappingURL=pipStores.js.map
