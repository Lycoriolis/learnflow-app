import type { LayoutLoad } from './$types';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';

export const load: LayoutLoad = ({ url, data }) => {
  console.log('Admin layout load, path:', url.pathname);
  
  // Allow the debug page to bypass admin checks
  const isDebugPage = url.pathname === '/admin/debug';
  
  if (isDebugPage) {
    console.log('Debug page detected, bypassing admin checks');
  }
  
  return {
    isDebugPage,
    path: url.pathname
  };
}; 