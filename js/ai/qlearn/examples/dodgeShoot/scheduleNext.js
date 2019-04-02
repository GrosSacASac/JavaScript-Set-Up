export {scheduleNext};

let scheduleNext;
if (window.requestAnimationFrame) {
	scheduleNext = requestAnimationFrame;
} else {
	const DELAY = 1;
	scheduleNext = (callback) => {
		setTimeout(callback, DELAY);
	};
}
