import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import red from "eslint-config-red";
import globals from "globals";
import stylistic from "@stylistic/eslint-plugin";


export default defineConfig([
    
	{
		files: [`source/**/*.js`],
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
		plugins: {
            '@stylistic': stylistic,
        },
		rules: {},
        extends: [
            js.configs.recommended,
            red,
        ],
	},
]);
