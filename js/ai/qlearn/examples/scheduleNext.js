export { scheduleNext };

let scheduleNext;
if (typeof requestAnimationFrame !== `undefined`) {
    scheduleNext = requestAnimationFrame;
} else {
    const DELAY = 0;
    scheduleNext = (callback, delay = DELAY) => {
        // exceeds call stack
        // if (delay === 0) {
        //     callback();
        // } else {
        setTimeout(callback, delay);
        // }
    };
}
