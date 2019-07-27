/* --Constructor with a pure function--
good:
* clean syntax
* no _new_ magic , no this
* immutability
* no side effect
* no prototype
* no real inheritance, only composition 
* constructor function are functions again, they simply return a value
* pure function

bad:
* each method is created again for each instance, do not use for a massive number of instance > 1000?0
* not easiest to understand

conclusion:
* this will cause the least bugs, private variables and public members are exactly identified,
* to edit a property in the  instance  pass new specifications to the constructor and forget the old instance see [1]
* __or__ define getter + setter in the public exposure [2], makes composition harder
* __or__ do not use Object.freeze and directly erase [3] WARNING: doing so will make your program less explicit, less pure, more error prone, harder to debug.
* note because constructor are like normal function and do not require new write them like normal function first letter small caps
*/
export { player, unfairPlayer };


const player = function (spec) {
    const secret = {};
    const { name, hitPoints } = spec; // unpacking
    const experience = 0; // default value
    const printCounter = 0;

    // 1 new function for each instance ...
    const toString = function () {
        printCounter += 1;
        return `\n${name}\n${hitPoints}\n${experience}
                    toStringCall = ${printCounter}`;
    };

    // put in this new object only public members
    // ES6 that lets you define object properties like this:
    // {method, other}
    // instead of
    // { method : method, other : other}
    return Object.freeze({ // immutable (see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) [3]
        name,
        get hitPoints() { // [2]
            return hitPoints;
        },
        set hitPoints(newValue) {
            //console.log(`new value for ${name}: ${newValue}`); 
            hitPoints = newValue;
        },
        experience,
        toString/*,
            addHitPoints */
    });
};

const unfairPlayer = function (spec) {
    const thisPlayer = player(spec);

    //modify property or [1]
    thisPlayer.hitPoints *= 2;

    const toString = function () {//extend parent property
        return "Warning, unfair:" + thisPlayer.toString();
    };

    return Object.freeze({
        name: thisPlayer.name,
        hitPoints: thisPlayer.hitPoints,
        experience: thisPlayer.experience,

        //add property
        cheater: true,
        toString,
        //disadvanteges of [2]
        get hitPoints() { // [2]
            return thisPlayer.hitPoints;
        },
        set hitPoints(newValue) {
            thisPlayer.hitPoints = newValue;
        }
    });
};

// Create:
const player1 = player({ name: "Gru", hitPoints: 100 });
// Use:
console.log(player1.toString());
player1.hitPoints += -50; //ouch ! //[2]
// [1] or we can do
// player1 = player({name: "Gru", hitPoints: 100 - 50});
console.log(player1.toString());

// Create:
const player2 = unfairPlayer({ name: "Lord Zoo", hitPoints: 100 });
// Use:
console.log(player2.toString());
player2.hitPoints += 20; //water is good !
return [player, unfairPlayer];