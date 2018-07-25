
/*
A world is a rectangle
Inside a world there are living creatures with
speed, direction, etc
*/
export {generateRandomWorld, drawWorld, updateWorld, generateSimpleWorld};

import {
    randomPositiveInt,
    randomInt,
    randomFloat
} from "../node_modules/utilsac/random.js";
import {
    fillArrayWithFunctionResult
} from "../node_modules/utilsac/utility.js";
import {Collisions, Circle, Polygon, Point} from "../node_modules/collisions/src/Collisions.mjs";


/*
*/
const drawWorld = function (context, world) {
    world.creatures.forEach(function (creature) {
        const {x, y, width, height} = creature;
        context.strokeRect(x, y, width, height)
    });
};



const generateSimpleWorld = function (width = 300, height = 300) {
    const world = {
        width,
        height,
        creatures : [{
            width: 30,
            height: 20,
            speedX: 0.5,
            speedY: 0.1,
            x: 15,
            y: 15
        }]
    };
    return world;
};

const generateRandomWorld = function (width = 300, height = 300) {
    const populationSize = 25;
    const world = {
        width,
        height,
        creatures : undefined
    };
    world.creatures = fillArrayWithFunctionResult(
        function () {
            return generateRandomCreature(world.width, world.height);
        },
        populationSize
    );
    return world;
};



const generateRandomCreature = function (maxX, maxY) {
    const maxSize = 5;
    const maxSpeed2d = 1
    const creature = {
        width: randomPositiveInt(maxSize),
        height: randomPositiveInt(maxSize),
        speedX: randomFloat(-maxSpeed2d, maxSpeed2d),
        speedY: randomFloat(-maxSpeed2d, maxSpeed2d),
        x: 0,
        y: 0
    };
    creature.x = randomFloat(0, maxX - creature.width);
    creature.y = randomFloat(0, maxY - creature.height);
    return creature;
};

const updateWorld = function (world) {
    world.creatures.forEach(function (creature) {
        creature.x = Math.min(world.width - creature.width, Math.max(0, creature.x + creature.speedX));
        creature.y = Math.min(world.height - creature.height, Math.max(0, creature.y + creature.speedY));
    });
};
