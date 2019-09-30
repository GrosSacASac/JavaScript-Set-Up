export { draw, report };


const draw = (state, frame) => {
    console.log(`----- ${frame} ------ `);
    for (let y = state.maxY; y >= 0; y -= 1) {
        const line = [`|`];
        for (let x = 0; x <= state.maxX; x += 1) {
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

const report = (qualityMap, state, frame) => {
    console.log(qualityMap);
    console.log(`total frames ${frame}`);
    console.log(`times touched rewards ${state.rewardsTouched.length}`);
    console.log(`times touched danger ${state.dangersTouched.length} at frames: ${state.dangersTouched}`);
};
