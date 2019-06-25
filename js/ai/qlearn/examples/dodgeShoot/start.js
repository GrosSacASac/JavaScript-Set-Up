import {
    reduceStateAndActionSeeAll,
    reduceStateAndActionSeeNearestOnly,
    reduceStateAndActionSeeAllDistance,
} from "./reduceState.js";
import { report, compactReport } from "./draw.js";
import { start } from "./dodgeShoot.js";

const reduceStateAndAction = reduceStateAndActionSeeAll;
const useIntelligence = true;
const MAX_FRAMES = 20;
const display = false;
const reward = 1;

const options = {
    reduceStateAndAction,
    useIntelligence,
    MAX_FRAMES,
    display,
    reward,
};

start(options).then(compactReport);
