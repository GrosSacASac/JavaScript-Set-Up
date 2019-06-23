import {
    reduceStateAndActionSeeAll,
    reduceStateAndActionSeeNearestOnly,
    reduceStateAndActionSeeAllDistance,
} from "./reduceState.js";
import { report } from "./draw.js";
import { start } from "./dodgeShoot.js";

const reduceStateAndAction = reduceStateAndActionSeeAll;
const useIntelligence = true;
const MAX_FRAMES = 20;
const display = false;
const collisionReward = 1 || -1

const options = {
    reduceStateAndAction,
    useIntelligence,
    MAX_FRAMES,
    display,
    collisionReward,
};

start(options).then(report);
