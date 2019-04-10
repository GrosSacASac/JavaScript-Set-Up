export {randomDecide};

const randomDecide = (actionNames) => {
    return actionNames[Math.floor(Math.random() * actionNames.length)];
};
