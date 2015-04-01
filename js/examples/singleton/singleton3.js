/* --Singleton with the revealing module --
good:
* simple
* elegant flow : we create everything, then expose some, that's it !
* at any point of time we have access to everything we need and nothing
* closed to change, open to extension

bad:
* no delayed creation

conclusion:
* elegant solution
*/
const game = (function () {
    "use strict";
    // private members
    let score = 0;
        
    // public members
    const setScore = function (newScore) {
        score = newScore;
    };
    
    const isGameOver = function () {
        return score > 100;
    };
    
    // expose public members only
    return {
        setScore,
        isGameOver
    };
}());


/*usage:
game.setScore(30);
*/
