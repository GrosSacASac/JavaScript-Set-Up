"use strict";
const MAX_FRAMES = 1000;
const DELAY = 0;

let frame = 0;
const draw = (state) => {
    console.log(`----- ${frame} ------ `);
    for (let y = state.maxY; y >= 0; y--) {
        let line = [`|`];
        for (let x = 0; x <= state.maxX; x++) {
            if (state.position[0] === x && state.position[1] === y) {
                line.push(`*`);
            } else if (state.dangers[0][0] === x && state.dangers[0][1] === y) {
                line.push(`X`);
            } else if (state.rewards[0][0] === x && state.rewards[0][1] === y) {
                line.push(`@`);
            } else {
                    line.push(` `)
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
    rewardsTouched: []
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
    // standBy: () => {
    //
    // }
};

const updateGame = (state) => {
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
            state.rewardsTouched.push(frame)
        }
    });
};

const intelligence = {
    learnFactor: 0.5,
    discountFactor: 0.9,
    exploreBonus: 0.04,
    decide: (hashedState, actions) => {
        let qualityForState = intelligence.qualityMap[hashedState];
        if (!qualityForState) {
            // first time in this situation
            intelligence.qualityMap[hashedState] = Object.keys(actions).map(action => {
                return [0, action]
            });
            qualityForState = intelligence.qualityMap[hashedState];
            // console.log(qualityForState)
        }
        const [highestQuality, highestQualityActionName] = qualityForState.sort(([qualityA], [qualityB]) => {
            return qualityB - qualityA;
        })[0];

        // console.log(119,highestQuality, qualityForState)
        return actions[highestQualityActionName];
    },
    qualityMap: {

    },
    learn:(previousHashedState, hashedStateAfter, scoreBefore, scoreAfter) => {
        // still sorted
        const qualityForState = intelligence.qualityMap[previousHashedState];
        if (previousHashedState === hashedStateAfter) {
            qualityForState[0][0] += -intelligence.exploreBonus;
            return;
        }
        const immediateReward = scoreAfter - scoreBefore;
        const nextQualityForState = intelligence.qualityMap[hashedStateAfter];
        let nextMaxQualityForState = 0;
        let nextHighestQualityActionName = 'unused';
        if (nextQualityForState) {
            [nextMaxQualityForState, nextHighestQualityActionName] = nextQualityForState.sort(([qualityA], [qualityB]) => {
                return qualityB - qualityA;
            })[0];
        }
        // console.log(144, nextQualityForState, nextMaxQualityForState);
        qualityForState[0][0] += intelligence.learnFactor * (
            immediateReward +
            intelligence.discountFactor * (nextMaxQualityForState - qualityForState[0][0])
        ) -intelligence.exploreBonus;
        // if (intelligence.exploreBonus > 0.04) {
        //     intelligence.exploreBonus -= 0.001;
        // }

    },
};

const state = initialState;

const step = () => {
    const hashedState = hashState(state);
    const scoreBefore = state.score;
    const action = intelligence.decide(hashedState, actions);
    action(state);
    updateGame(state); // reward
    // draw(state);
    const hashedStateAfter = hashState(state);
    const scoreAfter = state.score;
    intelligence.learn(hashedState, hashedStateAfter, scoreBefore, scoreAfter);
    frame++;
    if (frame < MAX_FRAMES) {
        setTimeout(step, DELAY)
    } else {
        console.log(intelligence.qualityMap)
        console.log(`total frames ${frame}`)
        console.log(`times touched rewards ${state.rewardsTouched.length}` );
        console.log(`times touched danger ${state.dangersTouched.length} at frames: ${state.dangersTouched}`);
    }
};

step();