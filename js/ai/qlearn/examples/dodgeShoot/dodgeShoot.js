export {start};

import {randomDecide} from "../../source/randomDecide.js"
import {createIntelligence, learn, decide} from "../../source/qlearn.js";
import {draw, report} from "./draw.js";
import {initialState} from "./initialState.js";
import {scheduleNext} from "./scheduleNext.js";
import {
    reduceStateAndActionSeeAll,
    reduceStateAndActionSeeNearestOnly,
    reduceStateAndActionSeeAllDistance,
} from "./reduceState.js";

let frame = 0;

const intelligence = createIntelligence();
    

const isValidPosition = (w, max) => {
  return w >=0 && w <= max;
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

const updateGame = (action, state) => {
    action(state, state.position);
    const [x, y] = state.position;
    /* missiles go down, if they touch the player it is a hit,
    if their position is not valid, it means they are out of the frame */
    state.missiles.forEach(([dangerX, dangerY]) => {
        // todo volume based collision
        if (x === dangerX && y === dangerY) {
            state.score += collisionReward;
        }
    });
    state.missiles = state.missiles.filter(([dangerX, dangerY]) => {
        return isValidPosition(dangerY, state.maxY);
    });
    state.missiles.forEach(missile => {
        missile[1] -= 1
    });

    // the enemy emits a missile every n frames
    if (frame % 4 === 0) {
        state.missiles.push(state.positionEnemy.slice());
    }
    // move enemy from left to right periodically
    if (frame % 60 > 30) {
        actions.moveLeft(state, state.positionEnemy);
    } else {
        actions.moveRight(state, state.positionEnemy);
    }
};

const state = initialState;
const actionNames = Object.keys(actions);


const reduceStateAndAction = reduceStateAndActionSeeAll;
const useIntelligence = true;
const MAX_FRAMES = 180;
const display = true;
const collisionReward = 1 || -1


const start = (options)=> {
    return new Promise((resolve, reject) => {
        const step = () => {
            let stateActions = reduceStateAndAction(state);
            const scoreBefore = state.score;
            let actionName
            if (useIntelligence) {
                actionName = decide(intelligence, stateActions, actionNames);
            } else {
                actionName = randomDecide(actionNames);
            }
            const action = actions[actionName];
            updateGame(action, state); // reward and changes state
            if (display) {
                draw(state, frame);
            }
            const previousStateActions = stateActions;
            stateActions = reduceStateAndAction(state);
            const scoreAfter = state.score;
            const reward = scoreAfter - scoreBefore;
            learn(intelligence, previousStateActions, stateActions, actionName, actionNames, reward);
            frame++;
            if (frame < MAX_FRAMES) {
                scheduleNext(step);
            } else {
                resolve([intelligence.qualityMap, state, frame]);
            }
        };
        step();
    });
};

start().then(report)
