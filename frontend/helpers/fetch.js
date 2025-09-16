/*
# RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Trần Phan Anh Khoa
# ID: s4136776
*/
const helper = {};

helper.status = /** const */ {
	UNAUTHENTICATED: 401,
};

/**
 * @type {(url: string | URL, data?: Record<string, any> | null) => Promise<any>}
 */
helper.get = async (url, data = undefined) => {
	const newUrl = new URL(url, location.origin);
	Object.entries(data ?? {}).forEach(([key, value]) => {
		(Array.isArray(value) ? value : [value]).forEach(v => newUrl.searchParams.append(key, String(v)));
	});
	const res = await fetch(newUrl.toString());
	return await res.json();
};

/**
 * @type {(url: string | URL, data?: Record<string, any> | null) => Promise<any> }
 */
helper.post = async (url, data) => {
	const res = await fetch(url, {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json',
		},
	});
	return await res.json();
};

/**
 * @type {(url: string | URL, data?: FormData) => Promise<any> }
 */
helper.postForm = async (url, data) => {
	const res = await fetch(url, {
		method: 'POST',
		body: data,
	});
	return await res.json();
};

export const fetchHelper = helper;
