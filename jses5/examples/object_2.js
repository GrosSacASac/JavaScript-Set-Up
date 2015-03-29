"use strict";

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

/* --Constructor with Prototypes--
good:
* shared methods are created only once, even for subclasses

bad:
* uses this and new --> danger
* prototype side effects

conclusion:
* 
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
    };

    //Put in the prototype everything that is and stays the same for all instances
    Player.prototype = {
        toString: function toString() {
            this.printCounter += 1;
            return "\n" + this.name + "\n" + this.hitPoints + "\n" + this.experience + "\n                   toStringCall = " + this.printCounter;
        }
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
    };

    //inherit all methods from Player
    //Note that changing UnfairPlayer.prototype will not change Player.prototype
    UnfairPlayer.prototype = Object.create(Player.prototype);

    //extend a method easily because we have direct access
    UnfairPlayer.prototype.toString = function () {
        return "Warning, unfair:" + Player.prototype.toString.apply(this);
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