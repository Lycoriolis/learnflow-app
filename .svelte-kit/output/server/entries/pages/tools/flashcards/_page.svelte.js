import { c as store_get, e as ensure_array_like, h as head, b as attr, f as escape_html, u as unsubscribe_stores, a as pop, p as push } from "../../../../chunks/index3.js";
import { p as persistentStore } from "../../../../chunks/persistentStore.js";
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  let filteredCards, sortedCards, uniqueTags;
  const flashcards = persistentStore("learnflow-flashcards", []);
  let currentCard = null;
  let newCardFront = "";
  let newCardBack = "";
  let newCardTags = "";
  function getNextCard() {
    const now = Date.now();
    const dueCards = sortedCards.filter((card) => !card.nextReview || card.nextReview <= now);
    if (dueCards.length === 0) return null;
    return dueCards[0];
  }
  filteredCards = store_get($$store_subs ??= {}, "$flashcards", flashcards);
  sortedCards = [...filteredCards].sort((a, b) => {
    {
      return (a.nextReview || 0) - (b.nextReview || 0);
    }
  });
  ({
    total: store_get($$store_subs ??= {}, "$flashcards", flashcards).length,
    mastered: store_get($$store_subs ??= {}, "$flashcards", flashcards).filter((c) => c.level === 5).length,
    dueToday: store_get($$store_subs ??= {}, "$flashcards", flashcards).filter((c) => !c.nextReview || c.nextReview <= Date.now()).length,
    avgLevel: store_get($$store_subs ??= {}, "$flashcards", flashcards).length ? Math.round(store_get($$store_subs ??= {}, "$flashcards", flashcards).reduce((sum, c) => sum + c.level, 0) / store_get($$store_subs ??= {}, "$flashcards", flashcards).length * 10) / 10 : 0
  });
  uniqueTags = Array.from(new Set(store_get($$store_subs ??= {}, "$flashcards", flashcards).flatMap((c) => c.tags)));
  if (!currentCard) {
    currentCard = getNextCard();
  }
  const each_array = ensure_array_like(uniqueTags);
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Flashcards | LearnFlow</title>`;
  });
  $$payload.out += `<div class="max-w-4xl mx-auto px-4 py-10"><div class="flex justify-between items-start mb-8"><div><h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center"><i class="fas fa-layer-group mr-3 text-orange-500"></i> Flashcards</h1> <p class="text-gray-600 dark:text-gray-400">Study smarter with spaced repetition flashcards</p></div></div> <div class="flex flex-wrap gap-4 mb-8"><select class="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"><option value="">All Tags</option><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let tag = each_array[$$index];
    $$payload.out += `<option${attr("value", tag)}>${escape_html(tag)}</option>`;
  }
  $$payload.out += `<!--]--></select> <select class="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"><option value="nextReview">Sort by Due Date</option><option value="level">Sort by Level</option><option value="created">Sort by Created</option></select></div> <div class="grid grid-cols-1 lg:grid-cols-5 gap-8"><div class="lg:col-span-3">`;
  if (currentCard) {
    $$payload.out += "<!--[-->";
    const each_array_1 = ensure_array_like(currentCard.tags);
    $$payload.out += `<div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"><div class="mb-4 flex justify-between items-center"><div class="flex gap-2"><!--[-->`;
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let tag = each_array_1[$$index_1];
      $$payload.out += `<span class="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded text-xs">${escape_html(tag)}</span>`;
    }
    $$payload.out += `<!--]--></div> <div class="text-sm text-gray-500 dark:text-gray-400">Level: ${escape_html(currentCard.level)}/5</div></div> <div role="button" tabindex="0" class="min-h-[200px] p-6 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-inner flex items-center justify-center cursor-pointer select-none mb-6 focus:outline-none focus:ring-2 focus:ring-orange-500"><div class="prose dark:prose-invert max-w-none text-center">${escape_html(currentCard.front)}</div></div> <div class="flex justify-between"><button class="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition flex items-center"><i class="fas fa-times mr-2"></i> Again</button> <button class="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition"><i class="fas fa-trash-alt"></i></button> <button class="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition flex items-center"><i class="fas fa-check mr-2"></i> Good</button></div></div>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center"><i class="fas fa-check-circle text-green-500 text-4xl mb-4"></i> <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">All Caught Up!</h3> <p class="text-gray-600 dark:text-gray-400">No cards due for review. Add new cards or check back later.</p></div>`;
  }
  $$payload.out += `<!--]--></div> <div class="lg:col-span-2"><div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"><h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Add New Card</h3> <div class="space-y-4"><div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Front</label> <textarea rows="3" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg" placeholder="Question or term...">`;
  const $$body = escape_html(newCardFront);
  if ($$body) {
    $$payload.out += `${$$body}`;
  }
  $$payload.out += `</textarea></div> <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Back</label> <textarea rows="3" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg" placeholder="Answer or definition...">`;
  const $$body_1 = escape_html(newCardBack);
  if ($$body_1) {
    $$payload.out += `${$$body_1}`;
  }
  $$payload.out += `</textarea></div> <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags</label> <input type="text"${attr("value", newCardTags)} class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg" placeholder="math, history, etc (comma separated)"></div> <button class="w-full py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition"${attr("disabled", !newCardFront.trim() || !newCardBack.trim(), true)}><i class="fas fa-plus mr-2"></i> Add Card</button></div></div></div></div></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
//# sourceMappingURL=_page.svelte.js.map
