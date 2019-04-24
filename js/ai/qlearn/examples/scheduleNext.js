export { scheduleNext };

let scheduleNext;
if (typeof requestAnimationFrame !== `undefined`) {
	scheduleNext = requestAnimationFrame;
} else {
	const DELAY = 0;
	scheduleNext = (callback) => {
		setTimeout(callback, DELAY);
	};
}
