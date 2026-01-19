/**
 * @param {function(*): *} callback 
 * @param  {...any} params 
 * @returns {*}
 */
export const safeInvoke = (callback, ...params) => {
    return safeInvokeOrDefault(callback, undefined, ...params);
}

/**
 * 
 * @param {function(*): *} callback 
 * @param {*} defaultResult 
 * @param  {...any} params 
 * @returns {*}
 */
export const safeInvokeOrDefault = (callback, defaultResult, ...params) => {
    try {
        return callback(...params);
    } catch (error) {
        return defaultResult;
    }
}