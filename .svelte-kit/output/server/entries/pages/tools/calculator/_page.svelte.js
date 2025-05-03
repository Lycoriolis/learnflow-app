import { e as ensure_array_like, h as head, f as escape_html, d as attr_class, b as attr, c as store_get, u as unsubscribe_stores, a as pop, p as push, j as stringify } from "../../../../chunks/index3.js";
import { c as calcDisplay, a as calcWaitingForSecondOperand, b as calcCurrentInput, d as calcPreviousValue, g as calcOperator } from "../../../../chunks/pipStores.js";
import { o as onDestroy } from "../../../../chunks/index-server.js";
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  let calculationHistory = [];
  onDestroy(() => {
    window.removeEventListener("keydown", handleKeydown);
  });
  function inputDigit(digit) {
    if (store_get($$store_subs ??= {}, "$calcWaitingForSecondOperand", calcWaitingForSecondOperand)) {
      calcDisplay.set(digit);
      calcWaitingForSecondOperand.set(false);
    } else {
      calcDisplay.set(store_get($$store_subs ??= {}, "$calcDisplay", calcDisplay) === "0" ? digit : store_get($$store_subs ??= {}, "$calcDisplay", calcDisplay) + digit);
    }
    calcCurrentInput.set(store_get($$store_subs ??= {}, "$calcDisplay", calcDisplay));
  }
  function inputDecimal() {
    if (store_get($$store_subs ??= {}, "$calcWaitingForSecondOperand", calcWaitingForSecondOperand)) {
      calcDisplay.set("0.");
      calcWaitingForSecondOperand.set(false);
      return;
    }
    if (!store_get($$store_subs ??= {}, "$calcDisplay", calcDisplay).includes(".")) {
      calcDisplay.set(store_get($$store_subs ??= {}, "$calcDisplay", calcDisplay) + ".");
      calcCurrentInput.set(store_get($$store_subs ??= {}, "$calcDisplay", calcDisplay));
    }
  }
  function clearAll() {
    calcDisplay.set("0");
    calcCurrentInput.set("");
    calcOperator.set(null);
    calcPreviousValue.set(null);
    calcWaitingForSecondOperand.set(false);
  }
  function handleOperator(nextOperator) {
    const inputValue = parseFloat(store_get($$store_subs ??= {}, "$calcDisplay", calcDisplay));
    if (store_get($$store_subs ??= {}, "$calcPreviousValue", calcPreviousValue) === null) {
      calcPreviousValue.set(inputValue);
    } else if (store_get($$store_subs ??= {}, "$calcOperator", calcOperator)) {
      const result = performCalculation();
      calcDisplay.set(String(result));
      calcPreviousValue.set(result);
    }
    calcWaitingForSecondOperand.set(true);
    calcOperator.set(nextOperator);
  }
  function performCalculation() {
    const prevValue = store_get($$store_subs ??= {}, "$calcPreviousValue", calcPreviousValue);
    const currentValue = parseFloat(store_get($$store_subs ??= {}, "$calcDisplay", calcDisplay));
    if (prevValue === null) return currentValue;
    let result;
    switch (store_get($$store_subs ??= {}, "$calcOperator", calcOperator)) {
      case "+":
        result = prevValue + currentValue;
        break;
      case "-":
        result = prevValue - currentValue;
        break;
      case "*":
        result = prevValue * currentValue;
        break;
      case "/":
        result = prevValue / currentValue;
        break;
      case "pow":
        result = Math.pow(prevValue, currentValue);
        break;
      default:
        return currentValue;
    }
    calculationHistory = [
      ...calculationHistory,
      `${prevValue} ${store_get($$store_subs ??= {}, "$calcOperator", calcOperator)} ${currentValue} = ${result}`
    ];
    return result;
  }
  function handleKeydown(event) {
    const key = event.key;
    if (/[0-9]/.test(key)) {
      inputDigit(key);
    } else if (key === ".") {
      inputDecimal();
    } else if (["+", "-", "*", "/"].includes(key)) {
      handleOperator(key);
    } else if (key === "Enter" || key === "=") {
      handleOperator("=");
    } else if (key === "Escape") {
      clearAll();
    } else if (key === "Backspace") {
      calcDisplay.set(store_get($$store_subs ??= {}, "$calcDisplay", calcDisplay).slice(0, -1) || "0");
    }
  }
  const each_array = ensure_array_like([
    7,
    8,
    9,
    "*",
    4,
    5,
    6,
    "-",
    1,
    2,
    3,
    "+",
    0,
    ".",
    "="
  ]);
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Scientific Calculator | LearnFlow</title>`;
  });
  $$payload.out += `<div class="max-w-2xl mx-auto px-4 py-10"><div class="flex justify-between items-start mb-8"><div><h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center"><i class="fas fa-calculator mr-3 text-purple-500"></i> Scientific Calculator</h1> <p class="text-gray-600 dark:text-gray-400">Advanced calculator with scientific functions</p></div> <div class="flex gap-2"><button class="text-sm px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"><i class="fas fa-history mr-2"></i> History</button> <button class="text-sm px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">${escape_html("Scientific")}</button></div></div> <div${attr_class(`grid grid-cols-1 ${stringify("")} gap-8`)}><div class="lg:col-span-2"><div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"><div class="mb-4 relative"><input type="text" class="w-full text-right px-4 py-3 text-2xl font-mono bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg"${attr("value", store_get($$store_subs ??= {}, "$calcDisplay", calcDisplay))} readonly> <button class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300" title="Copy to clipboard"><i class="fas fa-copy"></i></button></div> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <div class="grid grid-cols-4 gap-2"><button class="p-4 bg-red-600 text-white rounded hover:bg-red-700 transition">AC</button> <button class="p-4 bg-gray-600 text-white rounded hover:bg-gray-700 transition">±</button> <button class="p-4 bg-gray-600 text-white rounded hover:bg-gray-700 transition">%</button> <button class="p-4 bg-purple-600 text-white rounded hover:bg-purple-700 transition">÷</button> <!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let key = each_array[$$index];
    const isOperator = ["*", "-", "+", "="].includes(String(key));
    const isZero = key === 0;
    $$payload.out += `<button${attr_class(`p-4 ${stringify(isOperator ? "bg-purple-600 hover:bg-purple-700" : "bg-gray-600 hover:bg-gray-700")} text-white rounded transition ${stringify(isZero ? "col-span-2" : "")}`)}>`;
    if (key === "*") {
      $$payload.out += "<!--[-->";
      $$payload.out += `<i class="fas fa-times"></i>`;
    } else if (key === "-") {
      $$payload.out += "<!--[1-->";
      $$payload.out += `<i class="fas fa-minus"></i>`;
    } else if (key === "+") {
      $$payload.out += "<!--[2-->";
      $$payload.out += `<i class="fas fa-plus"></i>`;
    } else if (key === "=") {
      $$payload.out += "<!--[3-->";
      $$payload.out += `<i class="fas fa-equals"></i>`;
    } else {
      $$payload.out += "<!--[!-->";
      $$payload.out += `${escape_html(key)}`;
    }
    $$payload.out += `<!--]--></button>`;
  }
  $$payload.out += `<!--]--></div></div></div> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
//# sourceMappingURL=_page.svelte.js.map
