"use strict";
const MAX_FRAMES = 1000;
const DELAY = 100;

let frame = 0;
const draw = (state) => {
    console.log(`----- ${frame} ------ `);
    for (let y = state.maxY; y >= 0; y--) {
        let line = [`|`];
        for (let x = 0; x <= state.maxX; x++) {
            if (state.position[0] === x && state.position[1] === y) {
                line.push(`*`);
            } else if (state.dangers.some(([dx, dy]) => {
                return dx === x && dy === y;
            })) {
                line.push(`X`);
            } else if (state.rewards.some(([dx, dy]) => {
                return dx === x && dy === y;
            })) {
                line.push(`@`);
            } else {
                line.push(` `);
            }
        }
        console.log(line.join(` `));
    }
};

const initialState = {
    maxX: 4,
    maxY: 4,
    position: [0,1],
    rewards: [[4,2]],
    dangers: [[3,3], [2,2],[4,1],[3,2]],
    score: 0,
    dangersTouched: [],
    rewardsTouched: [],
};

const hashState = (state) => {
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


const intelligence = {
    defaultQuality: 0,
    learnFactor: 0.5,
    discountFactor: 0.9,
    exploreBonus: 0.04,
    decide: (hashedState, actionNames) => {
        let qualityForState = intelligence.qualityMap[hashedState];
        if (!qualityForState) {
            return actionNames[0] // take first (random)
        }
        const [highestQuality, highestQualityActionName] = qualityForState.sort(([qualityA], [qualityB]) => {
            return qualityB - qualityA;
        })[0];

        return highestQualityActionName;
    },
    qualityMap: {
        // [[quality, actionName]]
    },
    learn: (previousHashedState, hashedStateAfter, previousAction, actionNames, reward) => {
        let qualityForState = intelligence.qualityMap[previousHashedState];
        if (!qualityForState) {
            // there was no quality map for this set of state and actions
            qualityForState = actionNames.map(actionName => {
                return [intelligence.defaultQuality, actionName];
            });
            intelligence.qualityMap[previousHashedState] = qualityForState;
        }

        
        const previousActionIndex = qualityForState.findIndex(([quality, actionName]) => {
            return actionName === previousAction;
        });
        
        if (previousHashedState === hashedStateAfter) {
            qualityForState[previousActionIndex][0] += -intelligence.exploreBonus;
            return;
        }
        const nextQualityForState = intelligence.qualityMap[hashedStateAfter];
        let nextMaxQualityForState = intelligence.defaultQuality; 
        let _ = '';
        if (nextQualityForState) {
            [nextMaxQualityForState, _] = nextQualityForState.sort(([qualityA], [qualityB]) => {
                return qualityB - qualityA;
            })[0];
        }

        qualityForState[previousActionIndex][0] += intelligence.learnFactor * (
            reward +
            intelligence.discountFactor * (nextMaxQualityForState - qualityForState[0][0])
        ) -intelligence.exploreBonus;
    },
};

const report = () => {
    console.log(intelligence.qualityMap)
    console.log(`total frames ${frame}`)
    console.log(`times touched rewards ${state.rewardsTouched.length}` );
    console.log(`times touched danger ${state.dangersTouched.length} at frames: ${state.dangersTouched}`);
};

const state = initialState;
const actionNames = Object.keys(actions)
const step = () => {
    const hashedState = hashState(state);
    const scoreBefore = state.score;
    const actionName = intelligence.decide(hashedState, actionNames);
    const action = actions[actionName];
    updateGame(action, state); // reward and changes state
    draw(state);
    const hashedStateAfter = hashState(state);
    const scoreAfter = state.score;
    const reward = scoreAfter - scoreBefore;
    intelligence.learn(hashedState, hashedStateAfter, actionName, actionNames, reward);
    frame++;
    if (frame < MAX_FRAMES) {
        setTimeout(step, DELAY)
    } else {
        report();
    }
};


step();