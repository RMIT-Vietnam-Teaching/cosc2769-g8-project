import ky from 'ky';

/**
 * @import { Input, Options, ResponsePromise } from 'ky'
 */

const helper = {};

helper.status = /** const */ {
	UNAUTHENTICATED: 401,
};

/**
 * @template T
 * @type {(url: Input, data?: Record<string, any> | null, options?: Options) => ResponsePromise<T> }
 */
helper.get = (url, data, options) => {
	return ky.get(url, {
		throwHttpErrors: false,
		...(options ?? {}),
		searchParams: new URLSearchParams(data ?? {}),
	});
};

/**
 * @template T
 * @type {(url: Input, data?: Record<string, any> | null, options?: Options) => ResponsePromise<T> }
 */
helper.post = (url, data, options) => {
	return ky.post(url, {
		throwHttpErrors: false,
		...(options ?? {}),
		json: data ?? undefined,
	});
};

/**
 * @template T
 * @type {(url: Input, data?: Record<string, any> | null, options?: Options) => ResponsePromise<T> }
 */
helper.put = (url, data, options) => {
	return ky.put(url, {
		throwHttpErrors: false,
		...(options ?? {}),
		json: data ?? undefined,
	});
};

/**
 * @template T
 * @type {(url: Input, data?: Record<string, any> | null, options?: Options) => ResponsePromise<T> }
 */
helper.patch = (url, data, options) => {
	return ky.patch(url, {
		throwHttpErrors: false,
		...(options ?? {}),
		json: data ?? undefined,
	});
};

/**
 * @template T
 * @type {(url: Input, data?: Record<string, any> | null, options?: Options) => ResponsePromise<T> }
 */
helper.delete = (url, data, options) => {
	return ky.delete(url, {
		throwHttpErrors: false,
		...(options ?? {}),
		json: data ?? undefined,
	});
};

/**
 * @template T
 * @type {(url: Input, data?: Record<string, any> | null, options?: Options) => ResponsePromise<T> }
 */
helper.head = (url, data, options) => {
	return ky.head(url, {
		throwHttpErrors: false,
		...(options ?? {}),
		searchParams: new URLSearchParams(data ?? {}),
	});
};

export const fetchHelper = helper;
