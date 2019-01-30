import * as d from "../node_modules/dom99/built/dom99ES.js";
import {shake, shakeSupport} from "../node_modules/dom99/plugins/shake/shake.js";

d.plugin(shake);

d.functions.slideChange = function (event) {
    fetch(`/slideChange`, {
        method: "POST"
    });
};

d.start();
