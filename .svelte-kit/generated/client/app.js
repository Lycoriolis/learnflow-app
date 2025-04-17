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
	() => import('./nodes/33')
];

export const server_loads = [];

export const dictionary = {
		"/": [3],
		"/calendar": [4],
		"/category/[slug]": [5],
		"/courses": [6],
		"/courses/[courseId]": [7],
		"/courses/[courseId]/lesson/[lessonId]": [8],
		"/events": [9],
		"/exercises": [10],
		"/exercises/[id]": [11],
		"/forums": [~12],
		"/forums/category/[categoryId]": [13],
		"/forums/topic/[id]": [~14],
		"/groups": [15],
		"/groups/create": [17],
		"/groups/[id]": [16],
		"/help": [18],
		"/login": [19],
		"/my-learning": [20],
		"/progress": [21],
		"/register": [22],
		"/reset-password": [23],
		"/settings": [24],
		"/statistics": [25],
		"/tools": [26],
		"/tools/calculator": [27],
		"/tools/chat": [28],
		"/tools/dictionary": [29],
		"/tools/flashcards": [30],
		"/tools/notepad": [31],
		"/tools/pomodoro": [32],
		"/tools/tasks": [33]
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