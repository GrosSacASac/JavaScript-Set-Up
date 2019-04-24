export {
    reduceStateAndActionSeeAll,
    reduceStateAndActionSeeNearestOnly,
    reduceStateAndActionSeeAllDistance,
}

const distanceFromVector = (x, y) => {
    return (x ** 2 + y ** 2) ** 0.5;
};

const reduceStateAndActionSeeNearestOnly = (state) => {
    // we omit actions because they are always the same 
    let missileInformation = state.missiles[0][1];

    return `${state.position}${missileInformation}`;
};

const reduceStateAndActionSeeAll = (state) => {
    return `${state.position}${state.missiles}`;
};

const reduceStateAndActionSeeAllDistance = (state) => {
    const [x, y] = state.position
    const distances = state.missiles.map(([xm, ym]) => {
        return distanceFromVector(xm - x, ym - y);
    });
    return `${distances}`;
};
