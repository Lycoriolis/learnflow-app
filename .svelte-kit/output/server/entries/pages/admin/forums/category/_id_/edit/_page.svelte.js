import { E as ensure_array_like, O as head, I as attr, F as escape_html, G as attr_class, M as bind_props, B as pop, z as push } from "../../../../../../../chunks/index.js";
import "../../../../../../../chunks/client.js";
function _page($$payload, $$props) {
  push();
  let data = $$props["data"];
  let { category } = data;
  let name = category.name;
  let description = category.description;
  let icon = category.icon || "fa-folder";
  let color = category.color || "blue";
  let saving = false;
  const colorOptions = [
    { value: "blue", label: "Blue" },
    { value: "green", label: "Green" },
    { value: "red", label: "Red" },
    { value: "purple", label: "Purple" },
    { value: "orange", label: "Orange" },
    { value: "indigo", label: "Indigo" },
    { value: "gray", label: "Gray" }
  ];
  const iconOptions = [
    { value: "fa-folder", label: "Folder" },
    { value: "fa-code", label: "Code" },
    {
      value: "fa-question-circle",
      label: "Question"
    },
    { value: "fa-book", label: "Book" },
    {
      value: "fa-graduation-cap",
      label: "Education"
    },
    { value: "fa-users", label: "Users" },
    { value: "fa-cogs", label: "Settings" },
    { value: "fa-laptop", label: "Computer" },
    { value: "fa-chart-bar", label: "Chart" }
  ];
  const each_array = ensure_array_like(iconOptions);
  const each_array_1 = ensure_array_like(colorOptions);
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Edit Category | Admin</title>`;
  });
  $$payload.out += `<div class="container mx-auto px-4 py-8"><a href="/admin/forums" class="text-blue-600 hover:underline mb-4 inline-block">← Back to Forum Management</a> <h1 class="text-2xl font-bold mb-6">Edit Category</h1> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <form class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"><div class="mb-4"><label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category Name</label> <input id="name" type="text"${attr("value", name)} class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required></div> <div class="mb-4"><label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label> <textarea id="description" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>`;
  const $$body = escape_html(description);
  if ($$body) {
    $$payload.out += `${$$body}`;
  }
  $$payload.out += `</textarea></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"><div><label for="icon" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Icon</label> <div class="flex items-center space-x-2"><select id="icon" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let option = each_array[$$index];
    $$payload.out += `<option${attr("value", option.value)}>${escape_html(option.label)}</option>`;
  }
  $$payload.out += `<!--]--></select> <div class="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-600 rounded-md"><i${attr_class(`fas ${icon} text-${color}-500`)}></i></div></div></div> <div><label for="color" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Color</label> <select id="color" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"><!--[-->`;
  for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
    let option = each_array_1[$$index_1];
    $$payload.out += `<option${attr("value", option.value)}>${escape_html(option.label)}</option>`;
  }
  $$payload.out += `<!--]--></select></div></div> <div class="flex justify-between"><button type="submit" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md disabled:opacity-50"${attr("disabled", saving, true)}>${escape_html("Save Changes")}</button> <button type="button" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md">Delete Category</button></div></form></div>`;
  bind_props($$props, { data });
  pop();
}
export {
  _page as default
};
