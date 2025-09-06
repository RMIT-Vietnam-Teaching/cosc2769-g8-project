import { z } from 'zod/v4';

import jsonHelper from './json.helper.js';

/**
 * @import { ZodString, ZodStringFormat, ZodBoolean } from "zod/v4"
 * @import { $ZodIssue, $ZodIssueCustom, $ZodRawIssue } from "zod/v4/core"
 */

const validationHelper = {};

/** @param {$ZodIssue[]} issues */
validationHelper.groupIssues = issues =>
	issues.reduce(
		/** @param {{[key: string]: string[]}} groups */
		(groups, { path, message }) => {
			const field = String(path[0]);
			if (field in groups) {
				groups[field].push(message);
			} else {
				groups[field] = [message];
			}
			return groups;
		},
		{},
	);

/** @param {$ZodIssue[]} issues */
validationHelper.zodErrorJSON = issues => jsonHelper.error(validationHelper.groupIssues(issues));

validationHelper.coerce = {
	/** @param {ZodString | ZodStringFormat} zString */
	string: zString => z.preprocess(val => (typeof val === 'string' ? val : ''), zString),
	/** @param {ZodBoolean} zBoolean */
	boolean: zBoolean => z.preprocess(val => (typeof val === 'boolean' ? val : false), zBoolean),
};

/**
 * @param {PropertyKey[]} path
 * @param {$ZodRawIssue[]} issues
 */
validationHelper.anyErrorAt = (path, issues) => issues.find(issue => path.find((v, i) => issue.path == null || issue.path.at(i) !== v) == null);

/**
 * @param {PropertyKey[]} path
 * @param {$ZodRawIssue[]} issues
 */
validationHelper.noErrorAt = (path, issues) => validationHelper.anyErrorAt(path, issues) == null;

/**
 * @param {PropertyKey[]} path
 * @param {$ZodRawIssue[]} issues
 */
validationHelper.setIssuesPath = (path, issues) => issues.map(i => i.path == null ? i : { ...i, path });

/**
 * @param {PropertyKey[]} path
 * @param {string} message
 * @returns {$ZodRawIssue}
 */
validationHelper.customIssue = (path, message) => ({
	code: 'custom',
	input: null,
	path, message,
});

export default validationHelper;
