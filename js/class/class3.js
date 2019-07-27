/* --Constructor with class--
good:
* shared methods are created only once, even for subclasses
* clean, standard syntax
* easiest to read
* you can only invoke a class via new, not via a function call which makes new and this safe again

bad:
* specifications for this syntax are only finished in 2015
*/
export { Player, UnfairPlayer };


class Player {
    constructor(spec) {
        //private member
        //secret is only accessible later if you create
        //links to it in this scope now
        const secret = {};

        //public members
        this.name = spec.name
        this.hitPoints = spec.hitPoints

        this.experience = 0; //default value
        this.printCounter = 0;
    }
    toString() {
        this.printCounter += 1;
        return `\n${this.name}\n${this.hitPoints}\n${this.experience}
                   toStringCall = ${this.printCounter}`;//`
    }
};

class UnfairPlayer extends Player {
    constructor(spec) {
        super(spec)//must be called before using this

        //modify property
        this.hitPoints *= 2;

        //add property
        this.cheater = true;
    }
    toString() {
        return "Warning, unfair:" + super.toString();
    }
}

// Create:
const player2 = new UnfairPlayer({ name: "Lord Zoo", hitPoints: 100 });
// Use:
console.log(player2.toString());


// Create:
const player1 = new Player({ name: "Gru", hitPoints: 100 });
// Use:
console.log(player1.toString());
player1.hitPoints += -50; //ouch !
console.log(player1.toString());
