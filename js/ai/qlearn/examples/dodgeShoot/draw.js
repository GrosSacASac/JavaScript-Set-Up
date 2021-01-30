export { draw, report, compactReport };


const draw = (state) => {
    console.log(`-------- ${state.frame} -------- `);
    for (let y = state.maxY; y >= 0; y -= 1) {
        const line = [`|`];
        for (let x = 0; x <= state.maxX; x += 1) {
            if (state.position[0] === x && state.position[1] === y) {
                line.push(`*`);
            } else if (state.positionEnemy[0] === x && state.positionEnemy[1] === y) {
                line.push(`+`);
            } else if (state.missiles.some(([dx, dy]) => {
                return dx === x && dy === y;
            })) {
                line.push(`|`);
            } else {
                line.push(` `);
            }
        }
        console.log(line.join(` `));
    }
};

const report = ({ state, qualityMap }) => {
    const { frame, score } = state;
    // todo find out why this works (it is a map not object, it should not work)
    console.log(JSON.stringify(qualityMap, null, 2));
    console.log(`quality map different set of states and actions ${qualityMap.size}`);
    console.log(`total frames ${frame}`);
    console.log(`score ${score}`);
};

const compactReport = ({
    state,
    /*qualityMap,*/
    reduceStateAndAction,
    useIntelligence,
    reward,
    learn,
}) => {
    const { frame, score } = state;

    let intelligence;
    let reduceStateName;
    let learnName;
    if (useIntelligence) {
        intelligence = `qLearn`;
        reduceStateName = `(${reduceStateAndAction.name})`;
        learnName = `(${learn.name || learn.xname})`;
    } else {
        intelligence = `random`;
        reduceStateName = ``;
        learnName = ``;
    }

    let rewardText;
    if (reward === 1) {
        rewardText = `positive reward`;
    } else {
        rewardText = `negative reward`;
    }

    const frameText = `${frame} frames`;
    const scoreText = `score: ${score} `;
    const compactMessage = `${intelligence}${reduceStateName}${learnName} ${rewardText} ${frameText} ${scoreText} `;
    console.log(compactMessage);
};
