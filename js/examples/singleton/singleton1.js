/* --Singleton with getInstance and init --
good:
* real singleton
* the singleton is not created until we call game.getInstance for the first time
* delayed creation
* this may help save memory before we use it 
* especially if we need to define the singleton long before using it
* (note that good js engines can optimize out such things in the other 
* singleton techniques by temporarly generating equivalent code)
* can be extended with special sublassing techniques (not recommended)
* the singleton could contain metadata in at the right place

bad:
* heavy
* at the end we have an instance + singleton but we only really want the instance
* if we want the singleton to be created with arguments we have to
* pipeline parameters trough getInstance, then init, and not at the top

conclusion:
* hard to read
* and taking advantage of the good points is rare in practice 
*/
let game = (function () {
    "use strict";
    
    // reference to the singleton
    let thisGame;
    
    // define init
    const init = function () {
    
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
    };

    // we do not return the singleton but a wrapper which wraps a function
    // to get the instance out of it
    return {
        getInstance: function () {
            // return the singleton, create one if it does not exist yet
            if (!thisGame) {
                thisGame = init();
            }
            return thisGame;
        }/*, we could include metadata here */
    };
}());

/*usage:
game1 = game.getInstance();
game.setScore(30);
*/
