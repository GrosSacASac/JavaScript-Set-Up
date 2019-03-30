import {createIntelligence} from "../../source/qlearn.js";
import {draw, report} from "./draw.js";
import {initialState} from "./initialState.js";

const MAX_FRAMES = 1000;
const DELAY = 100;

let frame = 0;

const intelligence = createIntelligence();

const hashState = (state) => {
    // we omit actions because they are always the same 
    return `${state.position}`;
};

const isValidPosition = (w, max) => {
  return w >=0 && w <= max;
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
        const [x, y] = state.position;
        const futureY = y + 1;
        if (!isValidPosition(futureY, state.maxY)) {
            return;
        }
        state.position[1] = futureY;
    },
    moveDown: (state) => {
        const [x, y] = state.position;
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
            state.position = [0,0];
            state.dangersTouched.push(frame)
        }
    });
    state.rewards.forEach(([X, Y]) => {
        if (x === X && y === Y) {
            state.score += 1;
            state.position = [0,0];
            state.rewardsTouched.push(frame);
        }
    });
};


const state = initialState;
const actionNames = Object.keys(actions);
const step = () => {
    const hashedState = hashState(state);
    const scoreBefore = state.score;
    const actionName = intelligence.decide(hashedState, actionNames);
    const action = actions[actionName];
    updateGame(action, state); // reward and changes state
    //draw(state, frame);
    const hashedStateAfter = hashState(state);
    const scoreAfter = state.score;
    const reward = scoreAfter - scoreBefore;
    intelligence.learn(hashedState, hashedStateAfter, actionName, actionNames, reward);
    frame++;
    if (frame < MAX_FRAMES) {
        requestAnimationFrame(step);
    } else {
        report(intelligence.qualityMap, state, frame);
    }
};


step();