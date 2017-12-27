/* safari 10 nomodule fix CC0-1.0
this snippet needs to be at the beginning of the 
<script type="module" src="main-as-module.js"> and associated
<script nomodule src="main-as-script.js">
by throwing an error early the rest of the code is not executed
but only downloaded and compiled for Safari 10
assumption main-as-module.js and main-as-script.js
 are both built from the same source

advantage is that there is no js file that needs to be inlined
 at the top of the html
 
conclusion: worse for Safari10 better for everyone else

*/
if (window.MAIN_EXECUTED) {
    // "warning main.js already executed"
    throw new Error("");
}
window.MAIN_EXECUTED = true;
