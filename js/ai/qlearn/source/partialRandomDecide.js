export { partialRandomDecide };
import { decide } from "./qlearn.js";
import { randomDecide } from "./randomDecide.js";


const defaultRandomRate = 0.2;
const partialRandomDecide = (intelligence, stateActions, actionNames, randomRate = defaultRandomRate, random = Math.random) => {
    if (random() < randomRate) {
        return decide(intelligence, stateActions, actionNames);
    }
    return randomDecide(actionNames, random);
};
