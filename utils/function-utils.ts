export const safeInvoke = <T>(callback: () => T): T | undefined => {
    return safeInvokeOrDefault(callback, undefined);
}

export const safeInvokeOrDefault = <T>(callback: () => T, defaultResult: T | undefined): T | undefined => {
    try {
        return callback();
    } catch {
        return defaultResult;
    }
}
