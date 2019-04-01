export {scheduleNext};

let scheduleNext;
if (window.requestAnimationFrame) {
	scheduleNext = requestAnimationFrame;
} else {
	scheduleNext = (callback) => {
		setTimeout(callback, 1);
	};
}
