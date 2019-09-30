import { createIntelligence, learn, decide } from "../../source/qlearn.js";
import { draw, report } from "./draw.js";
import { initialState } from "./initialState.js";
import { scheduleNext } from "../scheduleNext.js";

const MAX_FRAMES = 2000;
const display = false;

let frame = 0;

const intelligence = createIntelligence();

const reduceStateAndAction = (state) => {
    // we omit actions because they are always the same 
    return `${state.position}`;
};

const isValidPosition = (w, max) => {
    return w >= 0 && w <= max;
};

const actions = {
    moveLeft: (state) => {
        const [x] = state.position;
        const futureX = x - 1;
        if (!isValidPosition(futureX, state.maxX)) {
            return;
        }
        state.position[0] = futureX;
    },
    moveRight: (state) => {
        const [x] = state.position;
        const futureX = x + 1;
        if (!isValidPosition(futureX, state.maxX)) {
            return;
        }
        state.position[0] = futureX;
    },
    moveUp: (state) => {
        const [, y] = state.position;
        const futureY = y + 1;
        if (!isValidPosition(futureY, state.maxY)) {
            return;
        }
        state.position[1] = futureY;
    },
    moveDown: (state) => {
        const [, y] = state.position;
        const futureY = y - 1;
        if (!isValidPosition(futureY, state.maxY)) {
            return;
        }
        state.position[1] = futureY;
    },
};

const updateGame = (action, state) => {
    action(state);
    const [x, y] = state.position;
    state.dangers.forEach(([dangerX, dangerY]) => {
        if (x === dangerX && y === dangerY) {
            state.score -= 1;
            state.position = [0, 0];
            state.dangersTouched.push(frame);
        }
    });
    state.rewards.forEach(([X, Y]) => {
        if (x === X && y === Y) {
            state.score += 1;
            state.position = [0, 0];
            state.rewardsTouched.push(frame);
        }
    });
};


const actionNames = Object.keys(actions);
const step = () => {
    const state = initialState;
    const stateActions = reduceStateAndAction(state);
    const scoreBefore = state.score;
    const actionName = decide({ intelligence, stateActions, actionNames });
    const action = actions[actionName];
    updateGame(action, state); // reward and changes state
    if (display) {
        draw(state, frame);
    }
    const stateActionsAfter = reduceStateAndAction(state);
    const scoreAfter = state.score;
    const reward = scoreAfter - scoreBefore;
    learn({
        intelligence,
        previousStateActions: stateActions,
        stateActions: stateActionsAfter,
        previousAction: actionName,
        actionNames,
        reward,
    });
    frame += 1;
    if (frame < MAX_FRAMES) {
        scheduleNext(step);
    } else {
        report(intelligence.qualityMap, state, frame);
    }
};


step();