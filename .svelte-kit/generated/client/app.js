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
	() => import('./nodes/41'),
	() => import('./nodes/42'),
	() => import('./nodes/43'),
	() => import('./nodes/44'),
	() => import('./nodes/45'),
	() => import('./nodes/46'),
	() => import('./nodes/47'),
	() => import('./nodes/48')
];

export const server_loads = [0,3];

export const dictionary = {
		"/": [~4],
		"/admin": [5,[3]],
		"/admin/courses": [~6,[3]],
		"/admin/dashboard": [~7,[3]],
		"/admin/forums": [~8,[3]],
		"/admin/forums/category/[id]/edit": [~9,[3]],
		"/admin/forums/topic/[id]/edit": [~10,[3]],
		"/admin/login": [11,[3]],
		"/admin/users": [~12,[3]],
		"/calendar": [13],
		"/category/[slug]": [~14],
		"/courses": [~15],
		"/courses/maths/mpsi-maths": [17],
		"/courses/[slug]": [~16],
		"/events": [18],
		"/exercises": [~19],
		"/exercises/maths": [21],
		"/exercises/maths/mpsi-maths": [22],
		"/exercises/maths/mpsi-maths/[exerciseId]": [23],
		"/exercises/[id]": [~20],
		"/forums": [~24],
		"/forums/category/[id]": [~25],
		"/forums/create": [26],
		"/forums/tag/[tag]": [~27],
		"/forums/topic/[id]": [~28],
		"/groups": [29],
		"/groups/create": [31],
		"/groups/[id]": [30],
		"/help": [32],
		"/login": [33],
		"/my-learning": [~34],
		"/progress": [35],
		"/register": [36],
		"/reset-password": [37],
		"/settings": [38],
		"/statistics": [39],
		"/tools": [40],
		"/tools/calculator": [41],
		"/tools/chat": [42],
		"/tools/dictionary": [43],
		"/tools/flashcards": [44],
		"/tools/notepad": [45],
		"/tools/pomodoro": [46],
		"/tools/tasks": [47],
		"/tools/workspace": [48]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
	
	reroute: (() => {}),
	transport: {}
};

export const decoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.decode]));

export const hash = false;

export const decode = (type, value) => decoders[type](value);

export { default as root } from '../root.js';