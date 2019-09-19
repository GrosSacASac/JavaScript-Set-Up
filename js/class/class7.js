/* Function based classes importable as namespaces
good:

* clean syntax
* no new , no this
* no side effect
* no prototype, instances do not carry a prototype chain
* compose and inherit
* constructor function are pure 
* compatible with object pools
* scales well
* methods can be pure functions or mutating functions
* you can store the methods in other variables, because it doesn't depend on the this
* compatible with higher-order functions
* explicit hierarchies
* class methods and instance custom function member are explicitly different in the calling program
* can be transferred as JSON over the network with no additional overhead
* also compatible with Web Worker / local storage by default
* treeshake friendly
* best possible minification

bad:

* Is not a widely used technique

to recognize that an instance is from a particular Object we can add the is function to the class.
It can check all required properties or an agreed-upon _is field.

*/
export { createPlayer, toString, createUnfairPlayer, unfairPlayerToString };
/* import as a nameSpace:
import * as Player from "./Player.js";

const player = Player.create({ ... });
const string = Player.toString(player);

*/

const create = function (constructorParameters) {
    //no privates
    const { name, hitPoints } = constructorParameters;
    const experience = 0; // default value
    const printCounter = 0;

    return {
        name,
        hitPoints,
        experience,
        printCounter
    };
};

const toString = function (player) { // explicit instance parameter
    player.printCounter += 1;
    return `\n${player.name}\n${player.hitPoints}\n${player.experience}
                toStringCall = ${player.printCounter}`;
};

const createUnfairPlayer = function (constructorParameters) {
    const thisPlayer = create(constructorParameters);

    thisPlayer.hitPoints *= 2;

    return thisPlayer;
};

const unfairPlayerToString = function (unfairPlayer) {
    return "Warning, unfair:" + toString(unfairPlayer);
};




const player1 = create({ name: "Gru", hitPoints: 100 });

console.log(toString(player1));
player1.hitPoints += -50;
console.log(toString(player1));

const player2 = createUnfairPlayer({ name: "Lord Zoo", hitPoints: 100 });

console.log(unfairPlayerToString(player2));
player2.hitPoints += 20;
