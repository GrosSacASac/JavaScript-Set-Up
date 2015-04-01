/* --Singleton with single object literal --
good:
* simple and compact
* 

bad:
* uses this
* forcing us to use apply, bind or => techniques to nest function depending
* on this
* no private members
* if we want a computed string as a key we have to do it before and 
* store it in a variable 
* if we want a computed value for a function inside that Object
* we are pretty much forced to create variables at the same level to do the computation

conclusion:
* good for small singletons, or
* good for singletons filled with static stuff (e.g string literals)
* bad for the rest
*/
"use strict";
game = {
    score: 0,
    setScore: function (newScore) {
        this.score = newScore;
    },
    isGameOver: function () {
        return this.score > 100;
    }
};

/*usage:
game.setScore(30);
*/
