const off = 0;
const warning = 1;
const error = 2;
module.exports = {
    "extends": "eslint:recommended",
    "rules": {
        // overwrite
        "no-unused-vars": warning,

        "prefer-object-has-own": error,
        "curly": error,
        "eqeqeq": error,
        "no-caller": error,
        "no-else-return": [error, { allowElseIf: false }],
        "no-extend-native": error,
        "no-extra-bind": error,
        "no-extra-label": error,
        "no-implicit-coercion": error,
        "no-lone-blocks": error,
        "no-magic-numbers": [warning, {
            "ignore": [
                -0.5, 0.5,
                -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
                10, 11, 12, 13, 14, 15, 16,
                100, 500, 1000,
                32,
                64,
                128,
                256,
                512,
                1024,
                90, 180, 360,
                -90, -180, -360,
            ]
        }],
        "no-multi-str": error,
        "no-new-wrappers": error,
        "no-octal-escape": error,
        "no-proto": error,
        "no-return-assign": [error, "always"],
        "no-return-await": error,
        "no-sequences": error,
        "no-unmodified-loop-condition": error,
        "no-unused-expressions": error,
        "no-useless-call": error,
        "no-void": error,
        // disable builtinGlobals for now because it also protects deprecated globals
        // https://github.com/eslint/eslint/issues/12167
        "no-shadow": [warning, { "builtinGlobals": false, hoist: "all" }],
        "max-params": [warning, { max: 6 }],
        "max-depth": [warning, { max: 10 }],
        "max-statements-per-line": [error, { max: 1 }],
        "new-parens": error,
        "no-array-constructor": error,
        "no-multi-assign": error,
        "no-ternary": error,
        "no-plusplus": error,
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
            "WithStatement",
            "BinaryExpression[operator='in']",
            "ClassDeclaration",
            "ClassExpression",
            "SwitchStatement",
            "ThisExpression",
        ]
        ,
        "quotes": [error, "backtick", { "avoidEscape": false }],

        "semi": [error, "always"],

        "semi-style": [error, "last"],
        "space-infix-ops": [error, { "int32Hint": false }],
        "arrow-body-style": [error, "always"],
        "no-var": error,
        "object-shorthand": [error, "properties"],
        "prefer-const": [error, { "ignoreReadBeforeAssign": false }],
        "prefer-destructuring": [warning, {
            "array": false,
            "object": true
        }, {
                "enforceForRenamedProperties": false
            }],

        "prefer-rest-params": error,
        "prefer-spread": error,
        "comma-dangle": [error, "always-multiline"]
    }
};
