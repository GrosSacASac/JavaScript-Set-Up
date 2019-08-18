import {
    reduceStateAndActionSeeAll,
    reduceStateAndActionSeeNearestOnly,
    reduceStateAndActionSeeAllDistance,
} from "./reduceState.js";
import { report, compactReport } from "./draw.js";
import { start } from "./dodgeShoot.js";
import { learn, learnWithAverage } from "../../source/qlearn.js";


const display = false;

const rewardsTrials = [1, -1];
const framesTrials = [2000, 20000, 200000];
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
        const options = {
            reduceStateAndAction: undefined,
            learn: undefined,
            MAX_FRAMES: frames,
            useIntelligence: false,
            display,
            reward,
        };
        start(options).then(compactReport);
        reduceStateTrials.forEach(reduceStateAction => {
            learnTrials.forEach(learn => {
                const options = {
                    reduceStateAndAction: reduceStateAction,
                    learn,
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
