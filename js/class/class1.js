/* --Basic Constructor--
good:
* easy to read
* available in ES5-

bad:
* methods are not shared between instances
* uses this and new
* inheritance is difficult, copies everything, indirect references
* no separation of concern: all in 1 function
*/
export { Player, UnfairPlayer };


const Player = function (spec) {
    //private member
    //secret is only accessible later if you create
    //links to it in this scope now
    const secret = {};

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

const UnfairPlayer = function (spec) {

    Player.call(this, spec); // call super constructor.

    //modify property
    this.hitPoints *= 2;

    //add property
    this.cheater = true;

    //extend functionality
    //as you can see we have no direct simple access to super toString

    /*option 1 we have duplicate code
    this.toString = function () {
        return `Warning, unfair:${this.name}\n${this.hitPoints}\n${this.experience}`;
    };*/
    //option 2 we create a local reference of another function( to avoid recursion)

    const supertoString = this.toString;
    this.toString = () => {
        return "Warning, unfair:" + supertoString.apply(this);
    };

};

// Create:
const player1 = new Player({ name: "Gru", hitPoints: 100 });
// Use:
console.log(player1.toString());
player1.hitPoints += -50; //ouch !
console.log(player1.toString());

// Create:
const player2 = new UnfairPlayer({ name: "Lord Zoo", hitPoints: 100 });
// Use:
console.log(player2.toString());
