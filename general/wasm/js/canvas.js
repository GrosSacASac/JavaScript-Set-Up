


export {reduceDraw, initializeCanvas};

const reduceDraw = function (canvas, drawFunctions) {
    const context2D = canvas.getContext("2d");
    return function (world) {
        context2D.clearRect(0, 0, canvas.width, canvas.height)
        drawFunctions.forEach(function (drawFunction) {
            drawFunction(context2D, world);
        });
    };
};

const initializeCanvas = function (canvas) {
    const resizeCanvas = function () {
        // makes it take 100% width and height
        const width = innerWidth;
        const height = innerHeight;
        canvas.width = width;
        canvas.height = height;
    };
    resizeCanvas();

    window.addEventListener("resize", resizeCanvas, false);
};
