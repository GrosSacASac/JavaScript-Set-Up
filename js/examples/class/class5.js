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
* methods can be pure functions
* you can store the methods in other variables, because it doesn t depend on the this
* compatible with high order functions
* explicit hierarchies

bad:

* store class wide methods as constructors field, which is uncommon practice (it works because functions are objects)

conclusion:
* 
*/

let [Player, unfairPlayer] = (function () {
    "use strict";
    let Player = function (constructorParameters) {
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
    

    let UnfairPlayer = function (constructorParameters) {
        let thisPlayer = Player(constructorParameters);

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
let player1 = Player({name: "Gru", hitPoints: 100});
// Use:
console.log(Player.toString(player1));
player1.hitPoints += -50; //ouch ! //[2]
// [1] or we can do
// player1 = player({name: "Gru", hitPoints: 100 - 50});
console.log(Player.toString(player1));

// Create:
let player2 = UnfairPlayer({name: "Lord Zoo", hitPoints: 100});
// Use:
console.log(player2.toString());
player2.hitPoints += 20; //water is good !