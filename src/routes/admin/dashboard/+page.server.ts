// Admin dashboard server-side loader
import { getAdminUsers } from '$lib/services/adminService.server';
import { getAllCourses } from '$lib/services/courseService';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    try {
        // Fetch dashboard data
        const [adminUsers, courses] = await Promise.all([
            getAdminUsers(),
            getAllCourses()
        ]);
        
        // Calculate stats
        const stats = {
            totalUsers: adminUsers.length,
            totalCourses: courses.length,
            totalLessons: courses.reduce((acc, course) => acc + (course.lessons?.length || 0), 0),
            totalExercises: 0 // You might need to fetch this separately
        };
        
        return {
            stats,
            success: true
        };
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        return {
            stats: {
                totalUsers: 0,
                totalCourses: 0, 
                totalLessons: 0,
                totalExercises: 0
            },
            success: false,
            error: 'Failed to load dashboard data'
        };
    }
};