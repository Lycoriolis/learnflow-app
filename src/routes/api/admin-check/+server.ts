import { json } from '@sveltejs/kit';
import { isUserAdmin } from '$lib/authService.js';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request, locals }) => {
  // For security in a real app, this endpoint should be protected!
  const adminEmailsRaw = import.meta.env.VITE_ADMIN_EMAILS || '';
  const adminEmails = adminEmailsRaw.split(',').map(email => email.trim());
  
  // Test emails
  const testEmails = [
    'beeelhaj@gmail.com',
    'admin@example.com',
    'admin@learnflow.com',
    'user@example.com'
  ];
  
  // Check each test email
  const results = testEmails.map(email => ({
    email,
    isAdmin: isUserAdmin(email),
    isInList: adminEmails.some(adminEmail => 
      adminEmail.toLowerCase() === email.toLowerCase()
    )
  }));
  
  return json({
    adminEmailsRaw,
    adminEmails,
    results,
    nodeEnv: process.env.NODE_ENV,
    isProd: process.env.NODE_ENV === 'production'
  });
}; 