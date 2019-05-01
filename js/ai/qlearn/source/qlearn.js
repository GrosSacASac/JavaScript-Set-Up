export { createIntelligence, learn, learnWithAverage, decide };

const createIntelligence = () => {
    return {
        defaultQuality: 0,
        learnFactor: 0.5,
        discountFactor: 0.9,
        exploreBonus: 0.04,
        qualityMap: new Map(), // reducedStateAction: [[quality, actionName]]
    };
};

const maxQuality = (qualityForState) => {
    return qualityForState.sort(([qualityA], [qualityB]) => {
        return qualityB - qualityA;
    })[0][0];
};

const averageQuality = (qualityForState) => {
    const sumQualityForState = qualityForState.reduce((sumSoFar, [quality]) => {
        return sumSoFar + quality;
    }, 0);
    return sumQualityForState / (qualityForState.length || 1);
};

const createLearn = (getNextQualityEstimation) => {
    return (intelligence, previousStateActions, stateActions, previousAction, actionNames, reward) => {
        let qualityForState = intelligence.qualityMap.get(previousStateActions);
        if (!qualityForState) {
            // there was no quality map for this set of state and actions
            qualityForState = actionNames.map(actionName => {
                return [intelligence.defaultQuality, actionName];
            });
            intelligence.qualityMap.set(previousStateActions, qualityForState);
        }

        const previousActionIndex = qualityForState.findIndex(([, actionName]) => {
            return actionName === previousAction;
        });

        const nextQualityForState = intelligence.qualityMap.get(stateActions);
        let nextQualityEstimation;
        if (nextQualityForState) {
            nextQualityEstimation = getNextQualityEstimation(nextQualityForState);
        } else {
            nextQualityEstimation = intelligence.defaultQuality
        }

        qualityForState[previousActionIndex][0] += intelligence.learnFactor * (
            reward +
            intelligence.discountFactor * (nextQualityEstimation - qualityForState[previousActionIndex][0])
        ) - intelligence.exploreBonus;
    }
};

const learn = createLearn(maxQuality);
const learnWithAverage = createLearn(averageQuality);

const decide = (intelligence, stateActions, actionNames) => {
    let qualityForState = intelligence.qualityMap.get(stateActions);
    if (!qualityForState) {
        return actionNames[0] // take first (random)
    }
    const [, highestQualityActionName] = qualityForState.sort(([qualityA], [qualityB]) => {
        return qualityB - qualityA;
    })[0];

    return highestQualityActionName;
};
