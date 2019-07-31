import { dataSet, dataSet2 } from "./data.js";


let weight = 0.5;
const learningFactor = 0.001;

const estimate = (weight, value) => {
    return (weight * value + 1) / 2;
};

const constrainRange = (x) => {
    return Math.atan(x) / Math.PI + 0.5;
};

const clamp = (x) => {
    return Math.min(Math.max(x, -1), 1);
}


const usedDataSet = randomShuffle(dataSet);

for (let i = 0; i < 10000; i += 1) {
    usedDataSet.forEach((data) => {
        const { height } = data;
        const normalizedHeight = constrainRange(height); // [0:1]
        const rawEstimate = estimate(weight, normalizedHeight); // [0:1]
        const binarayEstimate = Math.round(rawEstimate); // 0 || 1
        if (binarayEstimate !== data.s) {
            let adjust = learningFactor;
            if (binarayEstimate > data.s) {
                adjust = -learningFactor;
            }
            weight = clamp(weight + adjust); // [-1: 1]
        }
        data.estimated = binarayEstimate;
    });
}

console.log(usedDataSet);
console.log(weight);