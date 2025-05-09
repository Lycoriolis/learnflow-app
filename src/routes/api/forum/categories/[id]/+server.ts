import type { RequestHandler } from '@sveltejs/kit';
import { updateCategory, deleteCategory } from '$lib/services/forumService';

export const PUT: RequestHandler = async ({ request, params }) => {
  const categoryId = params.id;
  const data = await request.json();

  if (!categoryId) {
    return new Response(JSON.stringify({ message: 'Category ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const updatedCategory = await updateCategory(categoryId, {
      name: data.name,
      description: data.description,
      icon: data.icon,
      color: data.color
    });
    
    if (!updatedCategory) {
      return new Response(JSON.stringify({ message: 'Category not found' }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify(updatedCategory), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating category:', error);
    return new Response(JSON.stringify({ message: 'Failed to update category' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: RequestHandler = async ({ params }) => {
  const categoryId = params.id;

  if (!categoryId) {
    return new Response(JSON.stringify({ message: 'Category ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const success = await deleteCategory(categoryId);
    
    if (!success) {
      return new Response(JSON.stringify({ message: 'Category not found' }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ message: 'Category deleted successfully' }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error deleting category:', error);
    // Check if the error is because there are topics in this category
    if (error.message && error.message.includes('Cannot delete category with topics')) {
      return new Response(JSON.stringify({ message: 'Cannot delete category that contains topics. Move or delete the topics first.' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ message: 'Failed to delete category' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};