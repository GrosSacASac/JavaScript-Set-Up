/* -- ESModule Singleton--
good:
* real singleton
* delayed creation
* minimalist

bad:
* ...

conclusion:
* new styntax is used
*/
export {getGame};

let game;
const getGame = function () {
    
    if (!game) { // create the game object only the first time
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
        game = {
            setScore,
            isGameOver
        };
    }
    // always return the game
    return game;
};

/*usage:
const theGame = getGame();
theGame.setScore(30);
*/
