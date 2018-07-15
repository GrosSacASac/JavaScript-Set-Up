import {d} from "../node_modules/dom99/source/dom99.js";
import {generateRandomWorld, drawWorld, updateWorld} from "./world.js";
import {reduceDraw, initializeCanvas} from "./canvas.js";


const drawEverything = reduceDraw(d.elements.canvas, [
    drawWorld
]);

const world = generateRandomWorld();

const loop = function () {
    requestAnimationFrame(loop);
    drawEverything(world);
    updateWorld(world);
};

d.start(
    {

    }, // functions
    {

    }, // initial feed
    document.body, // start Element
    function () {
        // function executes after dom99 went through
        // here you can use d.elements

        d.elements.loadingHint.remove();
        initializeCanvas(d.elements.canvas);
        requestAnimationFrame(loop);
});
