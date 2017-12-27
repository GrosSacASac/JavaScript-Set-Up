# Strategies for using ES2015+

There are various ways to deliver a functioning web app while using ES2015+ JavaScript as a development language.


## Build overview


 * Transpile everything
 * Multiple builds
 * Multiple front ends

 
## Detection Overview

 * No detections
 * Server side feature detection
 * Client side feature detection
    * Using script type=module
    * Using try catch
    



## Build

## Transpile everything

Generate a single ES5 file (depending on your target).


### Advantages

Easiest to set up and understand.


### Disadvantages

Probably a certain number of users use a modern browser that understands modern ES2015+ syntax and download unnecessary polyfills and more, which slows down page load compared to Multiple builds.



## Multiple builds

From a single entry JavaScript file, it is possible to generate multiple bundles, each made to be run on different host environment.

### Advantages

Can create optimized JavaScript bundles for specific set-up. Due to syntactic sugar and other features, an ES2015 bundle can be significantly smaller in size (KB) than another ES5 bundle.

Serving a file that are is very close to the original source files also makes the application easier to debug in production.


### Disadvantages

Serving different js files like ES3 ES5 and ES2015 also requires feature detection.


## Multiple front ends

Manually create multiple front ends (HTML, JS, CSS) and each of those has its own js build. This pattern can be used for other media capabilities: such as mobile/desktop. For client-side feature detection, there are 2 strategies: Use the build with more requirement and inside an if statement in a script detect if downgrade is required. Or, by default serve a low requirement front end, and inside an if statement in a script detect if an upgrade is possible.

### Advantages

Can create builds even more optimized for each configuration. Due to syntactic sugar and other features, an ES2015 bundle can be significantly smaller in size (KB) than another ES5 bundle.

Can make assumptions such as: The device that does not have recent features will also have lower hardware on average, and using that assumption to serve light versions.


### Disadvantages

Development time is higher. Requires feature detection. Experience maybe less consistent.



## Detection


### No detection

No detection is usually paired with Transpile everything


### Server side feature detection


When a user loads a web-page its computer will make a HTTP request to the server. That HTTP request contains information that the server can read before sending a response: URL, Cookies, User-Agent, Accept-Encoding, Accept etc. Those information can be used to guess what features are available on the requesting user-agent. The big problem is that this technique is very fragile used on its own. The main reason is that most browsers lie about User-Agent.

### Client side feature detection


#### `<script type="module">`

`<script type="module" src="es2015.js">` in combination with `<script nomodule src="es5.js">` is an effective technique for any browser to download the right thing.

Browsers that do support `<script type="module">` will download and execute its `src`. While ignoring every `<script nomodule>`.

On the other hand browsers that do not support `<script type="module">` will do the opposite.

Combine this with the knowledge that every browser that supports `<script type="module">` also supports most ES2015. (TODO What features exactly ?)

This technique's cost is almost zero.

The biggest problem with this technique is that it is frozen: To use say a ES2018 feature, one would have to transpile this feature even for `<script type="module">` returning to the transpile everything approach, except now it is ES2015 instead of ES5. Or use more feature detection.

Note: JavaScript for `<script type="module">` should be bundled still (Use rollup or webpack for instance). To avoid client-server round-trips. Even with HTTP2 push and `<link rel="preload">`, resolving imports and exports still has a cost.


#### try eval catch

Test for the existence of every wanted feature in a `try` + `eval`.
What it looks like:

```
<!-- inside index-new.html -->
<script>
try {
    eval("class ClassTester {}; new Map(); ((...x) => (x)); ");
    // nothing went wrong
} catch (error) {
    // at least one thing went wrong
    location.href = "https://www.example.com/index-legacy.html";
}
</script>
```

Doing the reverse is a good idea for automatic website upgrade.

```
<!-- inside index-legacy.html -->
<script>
try {
    eval("class ClassTester {}; new Map(); ((...x) => (x)); ");
    // nothing went wrong
    location.href = "https://www.example.com/index-new.html";
} catch (error) {
    // at least one thing went wrong
    // browser was not changed/upgraded enough since last time
}
</script>
```

In this example `location.href` is used, but instead cookies with reload and the server reading the cookie could be used.

This technique is the most reliable and flexible for feature detection. Inside index-new.html put a `<script>` that loads something that will work because every feature the script uses has been tested in the `try eval` .Inside index-legacy.html put a `<script>` that has been appropriately compiled to ES5 or ES3.

Every-time a new feature is used add it inside the `eval`.



## Hybrid

TODO Explore and explain hybrid techniques more.



## Before you begin

Define the target audience, and the lowest common set of features of browsers from that audience.


## Definitions


### Transpiler

A compiler that compiles from one human programming language to another. Examples
Babel and Bublé


### Polyfill

A polyfill in JavaScript is a back-port of a standard feature for not yet up to date environments.


## Contribution

Submit an issue or a pull request.


## Links

 * [script type module for ES2015](https://philipwalton.com/articles/deploying-es2015-code-in-production-today/)
 * [try eval catch technique video](https://www.youtube.com/watch?v=M1qm-AWWu-M&t=1524)
 * [webpack bundler](https://webpack.js.org/)
 * [parcel-bundler](https://parceljs.org/)
 * [rollup module bundler](https://rollupjs.org/)
 * [babel transpiler standard, extensible](https://babeljs.io/)
 * [bublé transpiler efficient, zero configuration](https://buble.surge.sh/guide/)
 * [Safari 10 nomodule fix](https://gist.github.com/samthor/64b114e4a4f539915a95b91ffd340acc)
 * [History of the browser user-agent string](https://webaim.org/blog/user-agent-string-history/)