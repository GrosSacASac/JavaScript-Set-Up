/* --Experiment (No name yet)--
good:

* clean syntax
* no _new_ magic , no this
* no side effect
* no prototype, instances do not carry a prototype chain
* compose and inherit
* "constructor" function are pure 
* compatible with object pools
* scales well


bad:

* store class wide methods as constructors field, which is uncommon practice (it works because functions are objects)

conclusion:
* this will cause the least bugs, private variables and public members are exactly identified,
* to edit a property in the  instance  pass new specifications to the constructor and forget the old instance see [1]
* __or__ define getter + setter in the public exposure [2], makes composition harder
* __or__ do not use Object.freeze and directly erase [3] WARNING: doing so will make your program less explicit, less pure, more error prone, harder to debug.
* note because constructor are like normal function and do not require new write them like normal function first letter small caps
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

    Player.toString = function (player) {
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