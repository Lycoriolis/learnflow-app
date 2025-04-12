import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  // Log admin route access for debugging
  if (event.url.pathname.startsWith('/admin')) {
    console.log('==== Server Hook: Admin Route Access ====');
    console.log('Path:', event.url.pathname);
    console.log('VITE_ADMIN_EMAILS:', process.env.VITE_ADMIN_EMAILS);
    console.log('=========================================');
  }
  
  const response = await resolve(event);
  return response;
}; 