"use strict";

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

/* --Constructor with a pure function--
good:
* clean syntax
* no _new_ magic , no this
* immutability
* no side effect
* no prototype
* no real inheritance, only composition that can look similar
* constructor function are functions again, they simply return a value
* pure function
* ad safe compatibility ?

bad:
* each method is created again for each instance, do not use for a massive number of instance > 1000?0
* not easiest to understand

conclusion:
* this will cause the least bugs, private variables and public members are exactly identified,
* to edit a property in the  instance  pass new specifications to the constructor and forget the old instance see [1]
* __or__ define getter + setter in the public exposure [2], makes composition harder
* __or__ do not use Object.freeze and directly erase [3] WARNING: doing so will make your program less explicit, less pure, more error prone, harder to debug.
* note because constructor are like normal function and do not require new write them like normal function first letter small caps
* 
*/

var _ref = (function () {
    "use strict";
    var player = function player(spec) {
        // let for everything
        var secret = {};var name = spec.name;

        var hitPoints = spec.hitPoints; // unpacking
        var experience = 0; // default value
        var printCounter = 0;

        // 1 new function for each instance ...
        var toString = function toString() {
            printCounter += 1;
            return "\n" + name + "\n" + hitPoints + "\n" + experience + "\n                    toStringCall = " + printCounter;
        };

        // put in this new object only public members
        // ES6 that lets you define object properties like this:
        // {method, other}
        // instead of
        // { method : method, other : other}
        return Object.freeze(Object.defineProperties({ // immutable (see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) [3]
            name: name,
            experience: experience,
            toString: toString /*,
                               addHitPoints */
        }, {
            hitPoints: {
                get: function () {
                    // [2]
                    return hitPoints;
                },
                set: function (newValue) {
                    //console.log(`new value for ${name}: ${newValue}`);
                    hitPoints = newValue;
                },
                enumerable: true,
                configurable: true
            }
        }));
    };

    // Create:
    var player1 = player({ name: "Gru", hitPoints: 100 });
    // Use:
    console.log(player1.toString());
    player1.hitPoints += -50; //ouch ! //[2]
    // [1] or we can do
    // player1 = player({name: "Gru", hitPoints: 100 - 50});
    console.log(player1.toString());

    //------------------------------------
    //inheritance do not copy at home

    var unfairPlayer = function unfairPlayer(spec) {
        var thisPlayer = player(spec);

        //modify property or [1]
        thisPlayer.hitPoints *= 2;

        var toString = function toString() {
            //extend parent property
            return "Warning, unfair:" + thisPlayer.toString();
        };

        return Object.freeze(Object.defineProperties({
            name: thisPlayer.name, //fake inherited property
            hitPoints: thisPlayer.hitPoints,
            experience: thisPlayer.experience,

            //add property
            cheater: true,
            toString: toString }, {
            hitPoints: {
                get: function () {
                    // [2]
                    return thisPlayer.hitPoints;
                },
                set: function (newValue) {
                    thisPlayer.hitPoints = newValue;
                },
                enumerable: true,
                configurable: true
            }
        }));
    };

    // Create:
    var player2 = unfairPlayer({ name: "Lord Zoo", hitPoints: 100 });
    // Use:
    console.log(player2.toString());
    player2.hitPoints += 20; //water is good !
    return [player, unfairPlayer];
})();

var _ref2 = _slicedToArray(_ref, 2);

var player = _ref2[0];
var unfairPlayer = _ref2[1];

//disadvanteges of [2]