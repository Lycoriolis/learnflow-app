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
	() => import('./nodes/31')
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
		"/help": [16],
		"/login": [17],
		"/my-learning": [18],
		"/progress": [19],
		"/register": [20],
		"/reset-password": [21],
		"/settings": [22],
		"/statistics": [23],
		"/tools": [24],
		"/tools/calculator": [25],
		"/tools/chat": [26],
		"/tools/dictionary": [27],
		"/tools/flashcards": [28],
		"/tools/notepad": [29],
		"/tools/pomodoro": [30],
		"/tools/tasks": [31]
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