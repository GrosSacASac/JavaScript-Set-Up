/*
usage xtest
const xtest = {
	name: 'xtest',
	code: (shared, finish) => {
                // do something
			finish(); // finishes the test
		};
	}
};

const testSuite = performanceTestFrameWork.create({
	tests: [xtest, /*otherTests*/],
	maxTime: 150
});
performanceTestFrameWork.runAll(testSuite);
*/
'use strict';
const {
  performance
} = require('perf_hooks');

const empty = () => {};

const performanceTestFrameWork = {
	create(options) {
		const {
			setup = empty,
			teardown = empty,
			tests,
			maxTime = 200
		} = options;
		
		
		return {
			setup,
			teardown,
			tests,
			maxTime,
			results: undefined
		};
	},
	
	runAll(performanceTest) {
		chainPromises(
			performanceTest.tests.map(test => {
				return () => {
					return performanceTestFrameWork.runOne(performanceTest, test);
				}
			})
		).then(results => {
			let bestSpeed = -1;
			results.forEach(({totalTime, totalRun, name}) => {
				const speed = totalRun / totalTime;
				bestSpeed = Math.max(bestSpeed, speed);
				console.log(`${name} ran ${totalRun} times in ${totalTime / 1000} seconds`);
			});
			console.log(`bestSpeed ${bestSpeed} (operation/ms)`);
			results.bestSpeed = bestSpeed;
			performanceTest.results = results;
		});
	},
	
	runOne(performanceTest, test) {
		const {
			setup,
			teardown,
			maxTime
		} = performanceTest;
		
		const {
			name,
			code
		} = test;
		
		let totalTime = 0;
		let lastStart = 0;
		let totalRun = 0;
		let nextTimeoutId; // not used yet
		
		const runOneChained = (whenFinished) => {
			nextTimeoutId = setTimeout(() => {
				const shared = {};
				setup(shared);
				lastStart = performance.now();
				code(shared, () => {
					totalTime += performance.now() - lastStart;
					totalRun += 1;
					teardown(shared);
					if (totalTime > maxTime) {
						whenFinished({totalTime, totalRun, name});
					} else {
						runOneChained(whenFinished);
					}
				});
			}, 0);
		};
		
		return new Promise((resolve, reject) => {
			runOneChained(resolve);
		});
	}
};

const chainPromises = function (promiseCreators) {
    const length = promiseCreators.length;
    const values = [];
    if (length === 0) {
        return Promise.resolve(values);
    }
    return new Promise(function (resolve, reject) {
        let i = 0;
        const chainer = function (value) {
            i += 1;
            values.push(value);
            if (i < length) {
                promiseCreators[i]().then(chainer);
            } else {
                resolve(values);
            }
        };
        promiseCreators[i]().then(chainer);
    });
};

module.exports = performanceTestFrameWork;
