// import resolve from '@rollup/plugin-node-resolve';

const name = `socketiyoClient`;

const commonOutputOptions = {
    // core output options
    name,
    // globals: [],

    // advanced output options
    // paths: {},
    // banner,
    // footer: ``,
    // intro: ``,
    // outro: ``,
    // sourcemap,
    // sourcemapFile,
    interop: false,
    extend: false,

    // danger zone
    // exports,
    // indent,
    strict: true,
    // freeze,
    namespaceToStringTag: false

    // experimental
    // entryFileNames,
    // chunkFileNames,
    // assetFileNames
};

export default { // can be an array (for multiple inputs)
    // core input options
    input: `source/socketiyo-client.js`,     // required
    // plugins: [resolve()],
    
    // external: [],

    // advanced input options
    // onwarn,
    // perf,

    // danger zone
    // acorn,
    // acornInjectPlugins,
    treeshake: {
        moduleSideEffects: true,
        moduleSideEffects: `no-external`,
    },
    // context,
    // moduleContext,


    output: [  // required (can be an array, for multiple outputs),
        Object.assign({
            format: `es`,
            file: `built/socketiyo-client.es.js`,
        }, commonOutputOptions),
        Object.assign({
            format: `iife`,
            file: `built/socketiyo-client.iife.js`,
        }, commonOutputOptions),
    ],

    watch: {
        // chokidar,
        // include,
        // exclude,
        clearScreen: true
    }
};
