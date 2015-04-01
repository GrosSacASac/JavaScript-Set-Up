const F = (function () {
    "use strict";
    return {
        '+': function (a, b) {
            return a + b;
        },
        '-': function (a, b) {
            return a - b;
        },
        '*': function (a, b) {
            return a * b;
        },
        '/': function (a, b) {
            return a / b;
        },
        '**': function (a, b) {
            return Math.pow(a, b);
        },
        '===': function (a, b) {
            return a === b;
        },
    };
}());
