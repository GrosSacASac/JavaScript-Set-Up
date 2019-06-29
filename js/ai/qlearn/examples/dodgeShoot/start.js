import {
    reduceStateAndActionSeeAll,
    reduceStateAndActionSeeNearestOnly,
    reduceStateAndActionSeeAllDistance,
} from "./reduceState.js";
import { report, compactReport } from "./draw.js";
import { start } from "./dodgeShoot.js";
import { learn, learnWithAverage } from "../../source/qlearn.js";


const learnWithAverage2 = (intelligence, previousStateActions, stateActions, previousAction, actionNames, reward) => {
    let qualityForState = intelligence.qualityMap[previousStateActions];
    if (!qualityForState) {
        // there was no quality map for this set of state and actions
        qualityForState = actionNames.map(actionName => {
            return [intelligence.defaultQuality, actionName];
        });
        intelligence.qualityMap[previousStateActions] = qualityForState;
    }

    const nextQualityForState = intelligence.qualityMap[stateActions];
    let nextAverageQualityForState = intelligence.defaultQuality;
    if (nextQualityForState) {
        const nextSumQualityForState = nextQualityForState.reduce((accumulutedSum, [quality]) => accumulutedSum + quality, 0);
        nextAverageQualityForState = nextSumQualityForState / (nextQualityForState.length || 1);
        // todo why put const above change the result to the better ?
    }

    const previousActionIndex = qualityForState.findIndex(([, actionName]) => {
        return actionName === previousAction;
    });
    qualityForState[previousActionIndex][0] += intelligence.learnFactor * (
        reward +
        intelligence.discountFactor * (nextAverageQualityForState - qualityForState[previousActionIndex][0])
    ) - intelligence.exploreBonus;
};

const reduceStateAndAction = reduceStateAndActionSeeAll;
const useIntelligence = true;
const MAX_FRAMES = 20;
const display = false;
// const reward = 1;

const rewardsTrials = [1, -1];
const framesTrials3 = [2000, 20000];
const framesTrials = [2000, 20000, 200000];
// debugging 
learn.xname = `learn`;
learnWithAverage.xname = `learnWithAverage`;
const learnTrials = [learn, learnWithAverage, learnWithAverage2];
const reduceStateTrials = [
    reduceStateAndAction,
    reduceStateAndActionSeeAll,
    reduceStateAndActionSeeAllDistance,
    reduceStateAndActionSeeNearestOnly,
];

framesTrials3.forEach(frames => {
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
