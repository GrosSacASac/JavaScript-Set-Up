/* --Basic Constructor--
good:
* easy to read
* available in ES5

bad:
* methods are not shared between instances
* uses this and new
* inheritance is difficult, copies everything, indirect references
* no separation of concern: all in 1 function

conclusion:
* do not use
*/
/* --Constructor with Prototypes--
good:
* shared methods are createdd only once, even for subclasses

bad:
* uses this and new

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
        
        //toString is built again for each instance !
        this.toString = function () {
            this.printCounter += 1;
            return `\n${this.name}\n${this.hitPoints}\n${this.experience}
                    toStringCall = ${this.printCounter}`;
        };
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
    
        //extend functionality
        //as you can see we have no direct simple access to super toString

        /*option 1 problem we have duplicate code
        this.toString = function () {
            return `Warning, unfair:${this.name}\n${this.hitPoints}\n${this.experience}`;
        };*/
        //option 2 problem we create a local reference of another function( to avoid recursion)
        //maybe we can take out apply and bind with => function
        const supertoString = this.toString;
        this.toString = function () {
            return "Warning, unfair:" + supertoString.apply(this);
        }.bind(this);

    };

    // Create:
    let player2 = new UnfairPlayer({name: "Lord Zoo", hitPoints: 100});
    // Use:
    console.log(player2.toString());
    
    return [Player, UnfairPlayer];
}());