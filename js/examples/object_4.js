/* --Constructor with a pure function--
good:
* clean syntax
* no _new_ magic , no this
* immutability
* no side effect
* no prototype
* no real inheritance, only composition that can look similar
* constructor function are functions again, they simply return a value
* ad safe compatibility

bad:
* each method is created again for each instance, do not use for a massive number of instance > 1000?0
* not easiest to understand

conclusion:
* this will cause the least bugs, private variables and public are clearly identified,
* you have to create a setter/ modifier if you want to edit a property in the  instance 
* __or__ pass new specifications to the constructor see [1]
* note because constructor are like normal function and do not require new write them like normal function first letter small caps
* 
*/
let [player, unfairPlayer] = (function () {
    "use strict";
    let player = function (spec) {
        // let for everything
        let secret = {},
            name = spec.name,
            hitPoints = spec.hitPoints,
            experience = 0, //default value
            printCounter = 0;

        //1 new function for each instance ...
        let toString = function () {
            printCounter += 1;
            return `\n${name}\n${hitPoints}\n${experience}
                    toStringCall = ${printCounter}`;
        };
        let addHitPoints = function (value) {
            hitPoints += value;
        };

        // put in this new object only public members
        // Note new ES6 that lets you define object properties like this:
        // {method, other}
        // instead of
        // { method : method, other : other}
        return Object.freeze({ // immutable (see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)
            name,
            hitPoints,
            experience,
            toString,
            addHitPoints
        });
    };
    
    // Create:
    let player1 = player({name: "Gru", hitPoints: 100});
    // Use:
    console.log(player1.toString());
    player1.addHitPoints(-50); //ouch !
    // [1] or we can do
    //player1 = player({name: "Gru", hitPoints: 100 - 50});
    console.log(player1.toString());

    //------------------------------------
    //inheritance do not copy at home

    let unfairPlayer = function (spec) {
        let thisPlayer = player(spec);
        
        //modify property or [1]
        thisPlayer.addHitPoints(thisPlayer.hitPoints); // * 2
        
        let toString = function () {
            return "Warning, unfair:" + thisPlayer.toString();
        };
        
        return Object.freeze({ // immutable (see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)
            name: thisPlayer.name,
            hitPoints: thisPlayer.hitPoints, 
            experience: thisPlayer.experience,
             
            //add property
            cheater: true,
            toString,
            addHitPoints: thisPlayer.addHitPoints
        });
    };

    // Create:
    let player2 = unfairPlayer({name: "Lord Zoo", hitPoints: 100});
    // Use:
    console.log(player2.toString());
    
    return [player, unfairPlayer];
}());