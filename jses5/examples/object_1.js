"use strict";

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

/* --Basic Constructor--
good:
* easy to read
* available in ES5-

bad:
* methods are not shared between instances
* uses this and new
* inheritance is difficult, copies everything, indirect references
* no separation of concern: all in 1 function

conclusion:
* do not use
*/

var _ref = (function () {
    "use strict";
    var Player = function Player(spec) {
        //private member
        //secret is only accessible later if you create
        //links to it in this scope now
        var secret = {};

        //public members
        this.name = spec.name;
        this.hitPoints = spec.hitPoints;
        this.experience = 0; //default value
        this.printCounter = 0;

        //toString is built again for each instance !
        this.toString = function () {
            this.printCounter += 1;
            return "\n" + this.name + "\n" + this.hitPoints + "\n" + this.experience + "\n                    toStringCall = " + this.printCounter;
        };
    };

    // Create:
    var player1 = new Player({ name: "Gru", hitPoints: 100 });
    // Use:
    console.log(player1.toString());
    player1.hitPoints += -50; //ouch !
    console.log(player1.toString());

    //------------------------------------
    //inheritance do not copy at home

    var UnfairPlayer = function UnfairPlayer(spec) {

        Player.call(this, spec); // call super constructor.

        //modify property
        this.hitPoints *= 2;

        //add property
        this.cheater = true;

        //extend functionality
        //as you can see we have no direct simple access to super toString

        /*option 1 problem we have duplicate code
        this.toString = function () {
            return `Warning, unfair:${this.name}\n${this.hitPoints}\n${this.experience}`;
        };*/
        //option 2 problem we create a local reference of another function( to avoid recursion)
        //maybe we can take out apply and bind with => function
        var supertoString = this.toString;
        this.toString = (function () {
            return "Warning, unfair:" + supertoString.apply(this);
        }).bind(this);
    };

    // Create:
    var player2 = new UnfairPlayer({ name: "Lord Zoo", hitPoints: 100 });
    // Use:
    console.log(player2.toString());

    return [Player, UnfairPlayer];
})();

var _ref2 = _slicedToArray(_ref, 2);

var Player = _ref2[0];
var UnfairPlayer = _ref2[1];