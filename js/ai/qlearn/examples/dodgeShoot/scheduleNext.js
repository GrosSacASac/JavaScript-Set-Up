export {scheduleNext};

let scheduleNext;
if (window.requestAnimationFrame) {
	scheduleNext = requestAnimationFrame;
} else {
	const DELAY = 10;
	scheduleNext = (callback) => {
		setTimeout(callback, DELAY);
	};
}
