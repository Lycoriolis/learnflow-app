// @ts-nocheck
import { getAllUsers } from '$lib/services/userService.server';
import type { PageServerLoad } from './$types';

export const load = async () => {
    const users = await getAllUsers();
    return { users };
};;null as any as PageServerLoad;