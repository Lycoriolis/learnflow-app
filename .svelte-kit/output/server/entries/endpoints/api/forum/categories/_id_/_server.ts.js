import { b as updateCategory, e as deleteCategory } from "../../../../../../chunks/forumService.js";
const PUT = async ({ request, params }) => {
  const categoryId = params.id;
  if (!categoryId) {
    return new Response(JSON.stringify({ message: "Category ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const data = await request.json();
  try {
    const updatedCategory = await updateCategory(categoryId, {
      name: data.name,
      description: data.description,
      icon: data.icon,
      color: data.color
    });
    if (!updatedCategory) {
      return new Response(JSON.stringify({ message: "Category not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify(updatedCategory), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return new Response(JSON.stringify({ message: "Failed to update category" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const DELETE = async ({ params }) => {
  const categoryId = params.id;
  if (!categoryId) {
    return new Response(JSON.stringify({ message: "Category ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const success = await deleteCategory(categoryId);
    if (!success) {
      return new Response(JSON.stringify({ message: "Category not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ message: "Category deleted successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    if (error.message && error.message.includes("Cannot delete category with topics")) {
      return new Response(JSON.stringify({ message: "Cannot delete category that contains topics. Move or delete the topics first." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ message: "Failed to delete category" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
export {
  DELETE,
  PUT
};
//# sourceMappingURL=_server.ts.js.map
