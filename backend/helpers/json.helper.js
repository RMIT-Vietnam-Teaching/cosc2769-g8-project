const jsonHelper = {};

/** @returns {{ success: true }} */
jsonHelper.ok = () => ({ success: true });

/**
 * @template T
 * @param {T} data
 * @returns {{ success: true, data: T }}
 **/
jsonHelper.data = (data) => ({ success: true, data });

/**
 * @param {string} redirect
 * @returns {{ success: true, redirect: string }}
 **/
jsonHelper.redirect = (redirect) => ({ success: true, redirect });

/**
 * @template T
 * @param {T} error
 * @returns {{ success: false, error: T }}
 **/
const createError = (error) => ({ success: false, error });

/**
 * @template {{[k: string]: string[]}} T
 * @param {T} errorGroups
 * @returns {{ success: false, error: {[k in keyof T]: T[k] }}}
 */
jsonHelper.error = (errorGroups) => createError(errorGroups);

/** @param {string[]} errorMsgs */
jsonHelper.errorMsg = (errorMsgs) => jsonHelper.error({ __global: errorMsgs });

export default jsonHelper;
