export { draw, report };


const draw = (state) => {
    console.log(`-------- ${state.frame} -------- `);
    for (let y = state.maxY; y >= 0; y--) {
        let line = [`|`];
        for (let x = 0; x <= state.maxX; x++) {
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

const report = ([qualityMap, state, frame]) => {
    console.log(JSON.stringify(qualityMap, null, 2));
    console.log(`qaulity map different set of states and actions ${qualityMap.size}`);
    console.log(`total frames ${frame}`);
    console.log(`score ${state.score}`);
};
