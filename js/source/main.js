/*globals:F, R, DOM99, JS99*/

"use strict";

DOM99.linkJsAndDom(); //now we listen to events

//JS99._vars_.x access a live variable

//init
JS99._vars_.a = 0;
JS99._vars_.b = 1;
JS99.calculate();
