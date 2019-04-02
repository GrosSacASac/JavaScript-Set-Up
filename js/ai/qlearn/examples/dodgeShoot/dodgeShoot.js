import {createIntelligence} from "../../source/qlearn.js";
import {draw, report} from "./draw.js";
import {initialState} from "./initialState.js";
import {scheduleNext} from "./scheduleNext.js";

const MAX_FRAMES = 1000;
const display = true;

let frame = 0;

const intelligence = createIntelligence();

const hashState = (state) => {
    // we omit actions because they are always the same 
    // consider only the first for now
    let missileInformation = state.missiles[0][1];
    
    return `${state.position}${missileInformation}`;
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
};

const updateGame = (action, state) => {
    action(state);
    const [x, y] = state.position;
    /* missiles go down, if they touch the player it is a hit,
    if their position is not valid, it means they are out of the frame */
    console.log(state.missiles);
    console.log(state.missiles.forEach);
    console.log(typeof (([dangerX, dangerY]) => {
        // todo volume based collision
        if (x === dangerX && y === dangerY) {
            state.score -= 1;
        }
    }));
    state.missiles.forEach(([dangerX, dangerY]) => {
        // todo volume based collision
        if (x === dangerX && y === dangerY) {
            state.score -= 1;
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
};


const state = initialState;
const actionNames = Object.keys(actions);
const step = () => {
    const hashedState = hashState(state);
    const scoreBefore = state.score;
    const actionName = intelligence.decide(hashedState, actionNames);
    const action = actions[actionName];
    updateGame(action, state); // reward and changes state
	if (display) {
        draw(state, frame);
	}
    const hashedStateAfter = hashState(state);
    const scoreAfter = state.score;
    const reward = scoreAfter - scoreBefore;
    intelligence.learn(hashedState, hashedStateAfter, actionName, actionNames, reward);
    frame++;
    if (frame < MAX_FRAMES) {
        scheduleNext(step);
    } else {
        report(intelligence.qualityMap, state, frame);
    }
};


step();