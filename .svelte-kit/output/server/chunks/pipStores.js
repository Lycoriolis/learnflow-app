import { w as writable } from "./index3.js";
import { p as persistentStore } from "./persistentStore.js";
const pipVisible = writable(false);
const activeTool = writable("timer");
const initialTimerState = {
  mode: { type: "work" },
  timeLeft: 25 * 60,
  // Default 25 mins work
  isRunning: false,
  cycle: 0
};
const timerState = persistentStore("learnflow-timer-state", initialTimerState);
const todos = persistentStore("learnflow-todos", []);
const notes = persistentStore("learnflow-notes", []);
const notepadContent = persistentStore("learnflow-notepad-content", "");
const focusSessions = persistentStore("learnflow-focus-sessions", []);
const exerciseSessions = persistentStore("learnflow-exercise-sessions", []);
const calcDisplay = writable("0");
const calcCurrentInput = writable("");
const calcOperator = writable(null);
const calcPreviousValue = writable(null);
const calcWaitingForSecondOperand = writable(false);
export {
  todos as a,
  activeTool as b,
  calcDisplay as c,
  calcWaitingForSecondOperand as d,
  exerciseSessions as e,
  focusSessions as f,
  calcCurrentInput as g,
  calcPreviousValue as h,
  calcOperator as i,
  notepadContent as j,
  notes as n,
  pipVisible as p,
  timerState as t
};
