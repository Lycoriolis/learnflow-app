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
	() => import('./nodes/21')
];

export const server_loads = [];

export const dictionary = {
		"/": [3],
		"/admin": [4,[2]],
		"/admin/courses": [5,[2]],
		"/admin/courses/new": [7,[2]],
		"/admin/courses/[courseId]": [6,[2]],
		"/admin/settings": [8,[2]],
		"/admin/statistics": [9,[2]],
		"/admin/users": [10,[2]],
		"/admin/users/new": [11,[2]],
		"/category/[slug]": [12],
		"/courses": [13],
		"/courses/[courseId]": [14],
		"/exercises": [15],
		"/login": [16],
		"/progress": [17],
		"/register": [18],
		"/reset-password": [19],
		"/settings": [20],
		"/statistics": [21]
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