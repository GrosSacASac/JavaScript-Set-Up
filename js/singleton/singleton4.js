/* --Singleton with the revealing module with shared values--
good:
* simple
* at any point of time we have access to everything we need and nothing more
* closed to change, open to extension
* no need to use getters and setters for dynamic exposed values

bad:
* no delayed creation
* need to explicitly use shared variables inside
* complexity for privates variables

conclusion:
* elegant solution, to avoid getters and setters everywhere, while having private
*/
const game = (function () {
    "use strict";
    // private members
    //let x;
    
    const API = {
        score: 0
    };
        
    
    const isGameOver = function () {
        return API.score > 100;
    };
    
    // add to the API constants here
    Object.assign(API, {
        isGameOver
    });
    
    return API;
}());


/*usage:
game.score = 30;
let over = game.isGameOver();
*/
