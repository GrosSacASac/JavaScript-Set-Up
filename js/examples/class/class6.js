/* --Experiment (No name yet)--
good:

* clean syntax
* no new , no this
* no side effect
* no prototype, instances do not carry a prototype chain
* compose and inherit
* "constructor" function are pure 
* compatible with object pools
* scales well
* methods can be pure functions or mutating functions
* you can store the methods in other variables, because it doesn't depend on the this
* compatible with high order functions. Factory pattern for free
* explicit hierarchies
* class methods and instance custom function member are explicitly different in the calling program
* can be transferred as JSON over the network with no additional overhead
* also compatible with Web Worker / local storage by default

bad:

* A class is at least an object with a "create" property that points to a function.
* Makes the class definition slightly heavier for very small classes
* Is not a widely used technique in legacy code. And sometimes it is better to use the original style 

to recognize that an instance is from a particular Object we can add the is function to the class. It can check all required properties or a special internal _is field.

conclusion:
* 
*/

let [Player, UnfairPlayer] = (function () {
    "use strict";
    let Player = {};
    
    Player.create = function (constructorParameters) {
        //no privates
        let {name, hitPoints} = constructorParameters,
            experience = 0, // default value
            printCounter = 0;

        return {
            name,
            hitPoints,
            experience,
            printCounter
        };
    };

    Player.toString = function (player) { // explicit instance parameter
        player.printCounter += 1;
        return `\n${player.name}\n${player.hitPoints}\n${player.experience}
                toStringCall = ${player.printCounter}`;
    };
    

    let UnfairPlayer = {};
    
    UnfairPlayer.create = function (constructorParameters) {
        let thisPlayer = Player.create(constructorParameters);

        thisPlayer.hitPoints *= 2;
        
        return thisPlayer;
    };
    
    UnfairPlayer.toString = function (unfairPlayer) {
        return "Warning, unfair:" + Player.toString(unfairPlayer);
    };


    return [Player, UnfairPlayer];
}());

/*Example*/
// Create:
let player1 = Player.create({name: "Gru", hitPoints: 100});
// Use:
console.log(Player.toString(player1));
player1.hitPoints += -50; //ouch ! //[2]
// [1] or we can do
// player1 = player({name: "Gru", hitPoints: 100 - 50});
console.log(Player.toString(player1));

// Create:
let player2 = UnfairPlayer.create({name: "Lord Zoo", hitPoints: 100});
// Use:
console.log(UnfairPlayer.toString(player2));
player2.hitPoints += 20; //water is good !