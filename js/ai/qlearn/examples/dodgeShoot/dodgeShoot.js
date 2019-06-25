export { start };

import { deepCopy } from "../node_modules/utilsac/utility.js";
import { randomDecide } from "../../source/randomDecide.js"
import { createIntelligence, learn, learnWithAverage, decide } from "../../source/qlearn.js";
import { draw, report } from "./draw.js";
import { initialState } from "./initialState.js";
import { scheduleNext } from "../scheduleNext.js";


const isValidPosition = (w, max) => {
    return w >= 0 && w <= max;
};

const actions = {
    moveLeft: (state, actor) => {
        const [x] = actor;
        const futureX = x - 1;
        if (!isValidPosition(futureX, state.maxX)) {
            return;
        }
        actor[0] = futureX;
    },
    moveRight: (state, actor) => {
        const [x] = actor;
        const futureX = x + 1;
        if (!isValidPosition(futureX, state.maxX)) {
            return;
        }
        actor[0] = futureX;
    },
};
const actionNames = Object.keys(actions);

const updateGame = (action, state, reward) => {
    action(state, state.position);
    const [x, y] = state.position;
    /* missiles go down, if they touch the player it is a hit,
    if their position is not valid, it means they are out of the frame */
    state.missiles.forEach(([dangerX, dangerY]) => {
        // todo volume based collision
        if (x === dangerX && y === dangerY) {
            state.score += reward;
        }
    });
    state.missiles = state.missiles.filter(([dangerX, dangerY]) => {
        return isValidPosition(dangerY, state.maxY);
    });
    state.missiles.forEach(missile => {
        missile[1] -= 1
    });

    // the enemy emits a missile every n frames
    if (state.frame % 4 === 0) {
        state.missiles.push(state.positionEnemy.slice());
    }
    // move enemy from left to right periodically
    if (state.frame % 60 > 30) {
        actions.moveLeft(state, state.positionEnemy);
    } else {
        actions.moveRight(state, state.positionEnemy);
    }
};

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

const start = (options) => {
    const {
        reduceStateAndAction,
        useIntelligence = true,
        MAX_FRAMES = 20000,
        display = false,
        reward = -1,
    } = options;

    const state = deepCopy(initialState);
    const intelligence = createIntelligence();

    return new Promise((resolve, reject) => {
        const step = () => {
            let stateActions = reduceStateAndAction(state);
            const scoreBefore = state.score;
            let actionName;
            if (useIntelligence) {
                actionName = decide(intelligence, stateActions, actionNames);
            } else {
                actionName = randomDecide(actionNames);
            }
            const action = actions[actionName];
            updateGame(action, state, reward); // reward and changes state
            if (display) {
                draw(state);
            }
            const previousStateActions = stateActions;
            stateActions = reduceStateAndAction(state);
            const scoreAfter = state.score;
            const scoreDifference = scoreAfter - scoreBefore;
            learnWithAverage2(intelligence, previousStateActions, stateActions, actionName, actionNames, scoreDifference);
            state.frame++;
            if (state.frame < MAX_FRAMES) {
                scheduleNext(step);
            } else {
                state.qualityMap = intelligence.qualityMap;
                resolve({
                    state,
                    qualityMap: intelligence.qualityMap,
                    reduceStateAndAction,
                    useIntelligence,
                    reward,
                });
            }
        };
        step();
    });
};
