import {
    reduceStateAndActionSeeAll,
    reduceStateAndActionSeeNearestOnly,
    reduceStateAndActionSeeAllDistance,
} from "./reduceState.js";
import { compactReport } from "./draw.js";
import { start } from "./dodgeShoot.js";
import { learn, learnWithAverage } from "../../source/qlearn.js";


const display = false;

const rewardsTrials = [1, -1];
const framesTrials = [
    2 * 10 ** 3,
    2 * 10 ** 4,
    2 * 10 ** 5,
];
// debugging 
learn.xname = `learn`;
learnWithAverage.xname = `learnWithAverage`;
const learnTrials = [learn, learnWithAverage];
const reduceStateTrials = [
    reduceStateAndActionSeeAll,
    reduceStateAndActionSeeAllDistance,
    reduceStateAndActionSeeNearestOnly,
];

framesTrials.forEach(frames => {
    rewardsTrials.forEach(reward => {
        // do not include random in the big loop 
        // as it will not change based on the algorithm
        const randomOptions = {
            reduceStateAndAction: undefined,
            learn: undefined,
            MAX_FRAMES: frames,
            useIntelligence: false,
            display,
            reward,
        };
        start(randomOptions).then(compactReport);
        reduceStateTrials.forEach(reduceStateAction => {
            learnTrials.forEach(learnAlgorithm => {
                const options = {
                    reduceStateAndAction: reduceStateAction,
                    learn: learnAlgorithm,
                    MAX_FRAMES: frames,
                    useIntelligence: true,
                    display,
                    reward,
                };
                start(options).then(compactReport);
            });
        });
    });
});
