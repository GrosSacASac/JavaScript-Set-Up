/* eslint config to be used with eslint:recommended
0 "off"
1 "warning"
2 "error"
*/
module.exports = {
    "extends": "eslint:recommended",
    "rules": {
        "curly": 2,
        "eqeqeq": 2,
        "no-caller": 2,
        "no-else-return": [2, { allowElseIf: false }],
        "no-extend-native": 2,
        "no-extra-bind": 2,
        "no-extra-label": 2,
        "no-implicit-coercion": 2,
        "no-lone-blocks": 2,
        "no-magic-numbers": 1,
        "no-multi-str": 2,
        "no-new-wrappers": 2,
        "no-octal-escape": 2,
        "no-proto": 2,
        "no-return-assign": [2, "always"],
        "no-return-await": 2,
        "no-sequences": 2,
        "no-unmodified-loop-condition": 2,
        "no-unused-expressions": 2,
        "no-useless-call": 2,
        "no-void": 2,
        // disable builtinGlobals for now because it also protects deprecated globals
        // https://github.com/eslint/eslint/issues/12167
        "no-shadow": [1, { "builtinGlobals": false, hoist: "all" }],
        "max-params": [1, { max: 6 }],
        "max-depth": [1, { max: 10 }],
        "max-statements-per-line": [2, { max: 1 }],
        "new-parens": 2,
        "no-array-constructor": 2,
        "no-multi-assign": 2,
        "no-ternary": 2,
        "no-plusplus": 2,
        "no-restricted-syntax": [
            "error",
            {
                "selector": "FunctionDeclaration",
                "message": `Do not use a function declaration. Use a function expression instead:
const x = function () {

};
`
            },
            {
                "selector": "ExportDefaultDeclaration",
                "message": "Do not use default export. Use named exports instead."
            },
            {
                "selector": "YieldExpression",
                "message": "Use regular functions that return a functions that closes over a variable instead of generators"
            },
        ]
        ,
        "quotes": [2, "backtick", { "avoidEscape": false }],

        "semi": [2, "always"],

        "semi-style": [2, "last"],
        "space-infix-ops": [2, { "int32Hint": false }],
        "arrow-body-style": [2, "always"],
        "no-var": 2,
        "object-shorthand": [2, "properties"],
        "prefer-const": [2, { "ignoreReadBeforeAssign": false }],
        "prefer-destructuring": [1, {
            "array": false,
            "object": true
        }, {
                "enforceForRenamedProperties": false
            }],

        "prefer-rest-params": 2,
        "prefer-spread": 2,
    }
};
