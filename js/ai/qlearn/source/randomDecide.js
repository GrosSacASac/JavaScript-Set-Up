export {randomDecide};


const randomDecide = (actionNames, random = Math.random) => {
    return actionNames[Math.floor(random() * actionNames.length)];
};
