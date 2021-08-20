export function setTimeoutPromise<T>(handler: (...args: any[]) => T, interval: number): Promise<T> {
    return new Promise(r => setTimeout(r, interval)).then(() => handler());
}
