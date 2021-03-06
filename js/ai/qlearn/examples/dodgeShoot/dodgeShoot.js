export { start };

import { deepCopy } from "../../node_modules/utilsac/deep.js";
import { randomDecide } from "../../source/randomDecide.js";
import { createIntelligence, decide } from "../../source/qlearn.js";
import { draw } from "./draw.js";
import { initialState } from "./initialState.js";
import { scheduleNext } from "../scheduleNext.js";

const framesASecond = 60;
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
    state.missiles = state.missiles.filter(([, dangerY]) => {
        return isValidPosition(dangerY, state.maxY);
    });
    state.missiles.forEach(missile => {
        missile[1] -= 1;
    });

    // the enemy emits a missile every n frames
    if (state.frame % 4 === 0) {
        state.missiles.push(state.positionEnemy.slice());
    }
    // move enemy from left to right periodically
    if (state.frame % framesASecond > (framesASecond / 2)) {
        actions.moveLeft(state, state.positionEnemy);
    } else {
        actions.moveRight(state, state.positionEnemy);
    }
};

const start = (options) => {
    const {
        reduceStateAndAction,
        learn,
        useIntelligence = true,
        MAX_FRAMES = 2 * 10 ** 4,
        display = false,
        reward = -1,
    } = options;

    const state = deepCopy(initialState);
    const intelligence = createIntelligence();

    return new Promise((resolve) => {
        const step = () => {
            const scoreBefore = state.score;
            let stateActions;
            let actionName;
            if (useIntelligence) {
                stateActions = reduceStateAndAction(state);
                actionName = decide({ intelligence, stateActions, actionNames });
            } else {
                actionName = randomDecide({ actionNames });
            }
            const action = actions[actionName];
            updateGame(action, state, reward); // reward and changes state
            if (display) {
                draw(state);
            }

            if (useIntelligence) {
                const previousStateActions = stateActions;
                stateActions = reduceStateAndAction(state);
                const scoreAfter = state.score;
                const scoreDifference = scoreAfter - scoreBefore;
                learn({
                    intelligence,
                    previousStateActions,
                    stateActions,
                    previousAction: actionName,
                    actionNames,
                    reward: scoreDifference,
                });
            }
            state.frame += 1;
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
                    learn,
                });
            }
        };
        step();
    });
};
