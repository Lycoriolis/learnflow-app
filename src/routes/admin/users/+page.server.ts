import { getAllUsers } from '$lib/services/userService.server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const users = await getAllUsers();
    return { users };
};