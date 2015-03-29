"use strict";

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/* --Constructor with class--
good:
* shared methods are created only once, even for subclasses
* clean, standard syntax
* easiest to read
* you can only invoke a class via new, not via a function call which makes new and this safe again

bad:
* specifications for this syntax are only finished in 2015

conclusion:
* the syntax is very similar to Python's syntax and maybe the choice #1
* it is very easy to inherit, but again it may be a trap for beginners
* 
*/

var _ref = (function () {
    "use strict";

    var Player = (function () {
        function Player(spec) {
            _classCallCheck(this, Player);

            //private member
            //secret is only accessible later if you create
            //links to it in this scope now
            var secret = {};

            //public members
            this.name = spec.name;
            this.hitPoints = spec.hitPoints;

            this.experience = 0; //default value
            this.printCounter = 0;
        }

        _prototypeProperties(Player, null, {
            toString: {
                value: function toString() {
                    this.printCounter += 1;
                    return "\n" + this.name + "\n" + this.hitPoints + "\n" + this.experience + "\n                   toStringCall = " + this.printCounter; //`
                },
                writable: true,
                configurable: true
            }
        });

        return Player;
    })();

    ;

    // Create:
    var player1 = new Player({ name: "Gru", hitPoints: 100 });
    // Use:
    console.log(player1.toString());
    player1.hitPoints += -50; //ouch !
    console.log(player1.toString());

    //------------------------------------
    //inheritance do not copy at home

    var UnfairPlayer = (function (Player) {
        function UnfairPlayer(spec) {
            _classCallCheck(this, UnfairPlayer);

            _get(Object.getPrototypeOf(UnfairPlayer.prototype), "constructor", this).call(this, spec); //must be called before using this

            //modify property
            this.hitPoints *= 2;

            //add property
            this.cheater = true;
        }

        _inherits(UnfairPlayer, Player);

        _prototypeProperties(UnfairPlayer, null, {
            toString: {
                value: function toString() {
                    return "Warning, unfair:" + _get(Object.getPrototypeOf(UnfairPlayer.prototype), "toString", this).call(this);
                },
                writable: true,
                configurable: true
            }
        });

        return UnfairPlayer;
    })(Player);

    // Create:
    var player2 = new UnfairPlayer({ name: "Lord Zoo", hitPoints: 100 });
    // Use:
    console.log(player2.toString());

    return [Player, UnfairPlayer];
})();

var _ref2 = _slicedToArray(_ref, 2);

var Player = _ref2[0];
var UnfairPlayer = _ref2[1];