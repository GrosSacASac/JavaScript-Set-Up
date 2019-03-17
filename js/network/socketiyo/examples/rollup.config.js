import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';


export default {
	input: `./exampleServer.js`,
	output: {
		file: `./built/exampleServerReady.js`,
		format: `cjs`,
		sourcemap: false
	},
	plugins: [
		resolve(),
		commonjs(),
	]
};