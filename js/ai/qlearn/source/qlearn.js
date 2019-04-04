export {createIntelligence};

const createIntelligence = () => {
    const intelligence = {
        defaultQuality: 0,
        learnFactor: 0.5,
        discountFactor: 0.9,
        exploreBonus: 0.04,
        qualityMap: {
            // [[quality, actionName]]
        },
        decide: (stateActions, actionNames) => {
            let qualityForState = intelligence.qualityMap[stateActions];
            if (!qualityForState) {
                return actionNames[0] // take first (random)
            }
            const [, highestQualityActionName] = qualityForState.sort(([qualityA], [qualityB]) => {
                return qualityB - qualityA;
            })[0];
    
            return highestQualityActionName;
        },
        learn: (previousStateActions, stateActions, previousAction, actionNames, reward) => {
            let qualityForState = intelligence.qualityMap[previousStateActions];
            if (!qualityForState) {
                // there was no quality map for this set of state and actions
                qualityForState = actionNames.map(actionName => {
                    return [intelligence.defaultQuality, actionName];
                });
                intelligence.qualityMap[previousStateActions] = qualityForState;
            }
    
            const previousActionIndex = qualityForState.findIndex(([, actionName]) => {
                return actionName === previousAction;
            });
            
            if (previousStateActions === stateActions) {
                qualityForState[previousActionIndex][0] += -intelligence.exploreBonus;
                return;
            }
            const nextQualityForState = intelligence.qualityMap[stateActions];
            let nextMaxQualityForState = intelligence.defaultQuality; 
            if (nextQualityForState) {
                [nextMaxQualityForState] = nextQualityForState.sort(([qualityA], [qualityB]) => {
                    return qualityB - qualityA;
                })[0];
            }
    
            qualityForState[previousActionIndex][0] += intelligence.learnFactor * (
                reward +
                intelligence.discountFactor * (nextMaxQualityForState - qualityForState[0][0])
            ) -intelligence.exploreBonus;
        },
    };

    return intelligence;
};
