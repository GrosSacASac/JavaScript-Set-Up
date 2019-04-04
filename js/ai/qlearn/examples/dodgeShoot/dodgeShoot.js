import {randomDecide} from "../../source/randomDecide.js"
import {createIntelligence} from "../../source/qlearn.js";
import {draw, report} from "./draw.js";
import {initialState} from "./initialState.js";
import {scheduleNext} from "./scheduleNext.js";

const useIntelligence = false;
const MAX_FRAMES = 2000;
const display = true;

let frame = 0;

const intelligence = createIntelligence();

const reduceStateAndAction = (state) => {
    // we omit actions because they are always the same 
    // consider only the first for now
    // todo try with distance
    let missileInformation = state.missiles[0][1];
    
    return `${state.position}${missileInformation}`;
};

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
            state.score += -1;
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
const step = () => {
    let stateActions = reduceStateAndAction(state);
    const scoreBefore = state.score;
    let actionName
    if (useIntelligence) {
        actionName = intelligence.decide(stateActions, actionNames);
    } else {
        actionName = randomDecide(stateActions, actionNames);
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
    intelligence.learn(previousStateActions, stateActions, actionName, actionNames, reward);
    frame++;
    if (frame < MAX_FRAMES) {
        scheduleNext(step);
    } else {
        report(intelligence.qualityMap, state, frame);
    }
};


step();