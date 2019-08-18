import {
    reduceStateAndActionSeeAll,
} from "./reduceState.js";
import { report, compactReport } from "./draw.js";
import { start } from "./dodgeShoot.js";
import { learn, learnWithAverage } from "../../source/qlearn.js";

const display = true;


// debugging 
learn.xname = `learn`;
learnWithAverage.xname = `learnWithAverage`;

const options = {
    reduceStateAndAction: reduceStateAndActionSeeAll,
    learn,
    MAX_FRAMES: 2000,
    useIntelligence: true,
    display,
    reward: -1,
};
start(options).then(report);
