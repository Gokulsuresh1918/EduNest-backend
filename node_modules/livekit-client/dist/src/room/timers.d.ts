/**
 * Timers that can be overridden with platform specific implementations
 * that ensure that they are fired. These should be used when it is critical
 * that the timer fires on time.
 */
export default class CriticalTimers {
    static setTimeout: (handler: TimerHandler, timeout?: number | undefined, ...arguments: any[]) => number;
    static setInterval: (handler: TimerHandler, timeout?: number | undefined, ...arguments: any[]) => number;
    static clearTimeout: (id: number | undefined) => void;
    static clearInterval: (id: number | undefined) => void;
}
//# sourceMappingURL=timers.d.ts.map