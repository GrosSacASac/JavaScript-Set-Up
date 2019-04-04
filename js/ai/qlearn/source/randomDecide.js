export {randomDecide};

const randomDecide = (_stateActions, actionNames) => {
    return actionNames[Math.floor(Math.random() * actionNames.length)];
};
