export { createIntelligence, learn, learnWithAverage, decide };

const createIntelligence = () => {
    return {
        defaultQuality: 0,
        learnFactor: 0.5,
        discountFactor: 0.9,
        exploreBonus: 0.04,
        qualityMap: new Map(), /* "reducedStateActionString" -> Map(
            "actionName" -> quality
            ) */
    };
};

const maxQuality = (qualityForState) => {
    let max = -Infinity;
    qualityForState.forEach(quality => {
        max = Math.max(max, quality);
    });
    return max;
};

const maxQualityActionName = (qualityForState) => {
    let max = -Infinity;
    let maxValueAction = ``;
    qualityForState.forEach((quality, actionName) => {
        if (quality > max) {
            max = quality;
            maxValueAction = actionName;
        }
    });
    return maxValueAction;
};

const averageQuality = (qualityForState) => {
    let total = 0;
    qualityForState.forEach(quality => {
        total += quality;
    });
    const average = total / (qualityForState.size || 1);
    return average;
};

const decide = (intelligence, stateActions, actionNames) => {
    const qualityForState = intelligence.qualityMap.get(stateActions);
    if (!qualityForState) {
        return actionNames[0]; // take first (random)
    }

    return maxQualityActionName(qualityForState);
};

const createLearn = (getNextQualityEstimation) => {
    return (intelligence, previousStateActions, stateActions, previousAction, actionNames, reward) => {
        let qualityForState = intelligence.qualityMap.get(previousStateActions);
        if (!qualityForState) {
            // there was no quality map for this set of state and actions
            qualityForState = new Map();
            actionNames.forEach(actionName => {
                qualityForState.set(actionName, intelligence.defaultQuality);
            });
            intelligence.qualityMap.set(previousStateActions, qualityForState);
        }

        const nextQualityForState = intelligence.qualityMap.get(stateActions);
        let nextQualityEstimation;
        if (nextQualityForState) {
            nextQualityEstimation = getNextQualityEstimation(nextQualityForState);
        } else {
            nextQualityEstimation = intelligence.defaultQuality;
        }

        const previousQuality = qualityForState.get(previousAction);
        qualityForState.set(previousAction, previousQuality + intelligence.learnFactor * (
            reward +
            intelligence.discountFactor * (nextQualityEstimation - previousQuality)
        ) - intelligence.exploreBonus);
    };
};

const learn = createLearn(maxQuality);
const learnWithAverage = createLearn(averageQuality);
