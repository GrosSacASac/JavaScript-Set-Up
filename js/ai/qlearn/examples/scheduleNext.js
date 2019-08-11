export { scheduleNext };

let scheduleNext;
if (typeof requestAnimationFrame !== `undefined`) {
    scheduleNext = requestAnimationFrame;
} else {
    const DELAY = 150;
    scheduleNext = (callback, delay = DELAY) => {
        setTimeout(callback, delay);
    };
}
