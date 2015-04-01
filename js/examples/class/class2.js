/* --Constructor with Prototypes--
good:
* shared methods are created only once, even for subclasses

bad:
* uses this and new --> danger
* prototype side effects

conclusion:
* 
*/
let [Player, UnfairPlayer] = (function () {
    "use strict";
    let Player = function (spec) {
        //private member
        //secret is only accessible later if you create
        //links to it in this scope now
        let secret = {};

        //public members
        this.name = spec.name;
        this.hitPoints = spec.hitPoints;
        this.experience = 0; //default value
        this.printCounter = 0;
    };

    //Put in the prototype everything that is and stays the same for all instances
    Player.prototype = {
        toString: function () {
            this.printCounter += 1;
            return `\n${this.name}\n${this.hitPoints}\n${this.experience}
                   toStringCall = ${this.printCounter}`;
        }
    };

    // Create:
    let player1 = new Player({name: "Gru", hitPoints: 100});
    // Use:
    console.log(player1.toString());
    player1.hitPoints += -50; //ouch !
    console.log(player1.toString());

    //------------------------------------
    //inheritance do not copy at home

    let UnfairPlayer = function (spec) {

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
    let player2 = new UnfairPlayer({name: "Lord Zoo", hitPoints: 100});
    // Use:
    console.log(player2.toString());
    
    return [Player, UnfairPlayer];
}());