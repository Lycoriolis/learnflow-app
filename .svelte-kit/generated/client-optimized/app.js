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
	() => import('./nodes/46')
];

export const server_loads = [0,3];

export const dictionary = {
		"/": [~4],
		"/admin": [5,[3]],
		"/admin/courses": [~6,[3]],
		"/admin/forums": [~7,[3]],
		"/admin/forums/category/[id]/edit": [~8,[3]],
		"/admin/forums/topic/[id]/edit": [~9,[3]],
		"/admin/users": [~10,[3]],
		"/calendar": [11],
		"/category/[slug]": [~12],
		"/courses": [~13],
		"/courses/maths/mpsi-maths": [15],
		"/courses/[slug]": [~14],
		"/events": [16],
		"/exercises": [~17],
		"/exercises/maths": [19],
		"/exercises/maths/mpsi-maths": [20],
		"/exercises/maths/mpsi-maths/[exerciseId]": [21],
		"/exercises/[id]": [~18],
		"/forums": [~22],
		"/forums/category/[id]": [~23],
		"/forums/create": [24],
		"/forums/tag/[tag]": [~25],
		"/forums/topic/[id]": [~26],
		"/groups": [27],
		"/groups/create": [29],
		"/groups/[id]": [28],
		"/help": [30],
		"/login": [31],
		"/my-learning": [~32],
		"/progress": [33],
		"/register": [34],
		"/reset-password": [35],
		"/settings": [36],
		"/statistics": [37],
		"/tools": [38],
		"/tools/calculator": [39],
		"/tools/chat": [40],
		"/tools/dictionary": [41],
		"/tools/flashcards": [42],
		"/tools/notepad": [43],
		"/tools/pomodoro": [44],
		"/tools/tasks": [45],
		"/tools/workspace": [46]
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