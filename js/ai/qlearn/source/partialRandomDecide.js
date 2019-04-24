export { partialRandomDecide };
import { decide } from "./qlearn.js";
import { randomDecide } from "./randomDecide.js";

const partialRandomDecide = (intelligence, stateActions, actionNames, randomRate = 0.2, random = Math.random) => {
    if (random() > randomRate) {
        return decide(intelligence, stateActions, actionNames);
    }
    return randomDecide(actionNames, random);
};
