import {d} from "../node_modules/dom99/source/dom99.js";
import {generateRandomWorld, generateSimpleWorld, drawWorld, updateWorld} from "./world.js";
import {reduceDraw, initializeCanvas} from "./canvas.js";

let drawEverything;

const world = generateSimpleWorld(800, 400) || generateRandomWorld(800, 400);

let animationFrameId = 0;
const loop = function () {
    animationFrameId = requestAnimationFrame(loop);
    drawEverything(world);
    updateWorld(world);
};

d.start(
    {
        playPause: function () {
            if (animationFrameId === 0) {
                animationFrameId = requestAnimationFrame(loop);
                d.feed(`playPause`, `Pause`);
            } else {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = 0;
                d.feed(`playPause`, `Play`);
            }

        }
    }, // functions
    {

    }, // initial feed
    document.body, // start Element
    function () {
        // function executes after dom99 went through
        // here you can use d.elements

        d.elements.loadingHint.remove();
        initializeCanvas(d.elements.canvas);
        drawEverything = reduceDraw(d.elements.canvas, [
            drawWorld
        ]);
        animationFrameId = requestAnimationFrame(loop);
});
