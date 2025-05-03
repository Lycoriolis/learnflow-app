import { a as getCategories, c as createCategory, b as updateCategory, e as deleteCategory } from "../../../../../chunks/forumService.js";
const GET = async () => {
  try {
    const categories = await getCategories();
    return new Response(JSON.stringify(categories), { status: 200 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return new Response("Failed to fetch categories", { status: 500 });
  }
};
const POST = async ({ request }) => {
  const data = await request.json();
  try {
    if (!data.name || !data.description || !data.icon || !data.color) {
      return new Response("Missing required fields", { status: 400 });
    }
    const newCategory = await createCategory(data);
    return new Response(JSON.stringify(newCategory), { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return new Response("Failed to create category", { status: 500 });
  }
};
const PUT = async ({ request }) => {
  const { id, ...data } = await request.json();
  if (!id) {
    return new Response("Category ID is required", { status: 400 });
  }
  try {
    const updated = await updateCategory(id, data);
    if (updated === null) {
      return new Response("Category not found", { status: 404 });
    }
    return new Response(JSON.stringify(updated), { status: 200 });
  } catch (error) {
    console.error("Error updating category:", error);
    return new Response("Failed to update category", { status: 500 });
  }
};
const DELETE = async ({ url }) => {
  const id = url.searchParams.get("id");
  if (!id) {
    return new Response("Category ID is required", { status: 400 });
  }
  try {
    const result = await deleteCategory(id);
    if (result === false) {
      return new Response("Category not found", { status: 404 });
    }
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === "Cannot delete category with topics") {
      return new Response("Cannot delete category that contains topics", { status: 400 });
    }
    console.error("Error deleting category:", error);
    return new Response("Failed to delete category", { status: 500 });
  }
};
export {
  DELETE,
  GET,
  POST,
  PUT
};
//# sourceMappingURL=_server.ts.js.map
