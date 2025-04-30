import * as universal_hooks from '../../../src/hooks.ts';

export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15'),
	() => import('./nodes/16'),
	() => import('./nodes/17'),
	() => import('./nodes/18'),
	() => import('./nodes/19'),
	() => import('./nodes/20'),
	() => import('./nodes/21'),
	() => import('./nodes/22'),
	() => import('./nodes/23'),
	() => import('./nodes/24'),
	() => import('./nodes/25'),
	() => import('./nodes/26'),
	() => import('./nodes/27'),
	() => import('./nodes/28'),
	() => import('./nodes/29'),
	() => import('./nodes/30'),
	() => import('./nodes/31'),
	() => import('./nodes/32'),
	() => import('./nodes/33'),
	() => import('./nodes/34'),
	() => import('./nodes/35'),
	() => import('./nodes/36'),
	() => import('./nodes/37'),
	() => import('./nodes/38'),
	() => import('./nodes/39'),
	() => import('./nodes/40'),
	() => import('./nodes/41')
];

export const server_loads = [0,3];

export const dictionary = {
		"/": [4],
		"/admin": [5,[3]],
		"/admin/courses": [~6,[3]],
		"/admin/forums": [~7,[3]],
		"/admin/forums/category/[id]/edit": [~8,[3]],
		"/admin/forums/topic/[id]/edit": [~9,[3]],
		"/admin/users": [~10,[3]],
		"/calendar": [11],
		"/category/[slug]": [12],
		"/courses": [13],
		"/courses/[slug]": [14],
		"/courses/[slug]/[lessonId]": [15],
		"/events": [16],
		"/exercises": [17],
		"/exercises/[slug]": [18],
		"/forums": [~19],
		"/forums/category/[id]": [~20],
		"/forums/tag/[tag]": [~21],
		"/forums/topic/[id]": [~22],
		"/groups": [23],
		"/groups/create": [25],
		"/groups/[id]": [24],
		"/help": [26],
		"/login": [27],
		"/my-learning": [28],
		"/progress": [29],
		"/register": [30],
		"/reset-password": [31],
		"/settings": [32],
		"/statistics": [33],
		"/tools": [34],
		"/tools/calculator": [35],
		"/tools/chat": [36],
		"/tools/dictionary": [37],
		"/tools/flashcards": [38],
		"/tools/notepad": [39],
		"/tools/pomodoro": [40],
		"/tools/tasks": [41]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
	
	reroute: universal_hooks.reroute || (() => {}),
	transport: universal_hooks.transport || {}
};

export const decoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.decode]));

export const hash = false;

export const decode = (type, value) => decoders[type](value);

export { default as root } from '../root.js';