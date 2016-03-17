##Hello

Here is the set up I will be using for my future JavaScript projects. ➳



##Libraries

[Ramda](https://github.com/ramda/ramda) Functional JavaScript
[DOM99](https://github.com/GrosSacASac/DOM99) UI



##Conventions

use lint rules that everyone uses

You may use [JSDocs comments](https://github.com/jsdoc3/jsdoc) to generate documentation .


##Linting and testing

JavaScript linting

JavaScript tests with [Jasmine](https://github.com/jasmine/jasmine). You have to write tests yourself.

HTML tests 

[Basic syntax](http://validator.w3.org/)

[User experience](https://www.modern.ie/en-us)

[Performance](http://yslow.org/)

Random UI test with [gremlins.js](https://github.com/marmelab/gremlins.js)

##Work flow


###When you start a new project

__Write specifications first__

What is your project ? Why ? For who ? How? What does it do, what does it not do ?

How is it going to work ? Business strategy ? Hobby ?

You can win a lot of time here, because changing the specification is easier than changing code. Writing the specification documents will force you to think about use scenarios and edge case before you write code. That saves a lot of code edits.

Draw screens like a comic with arrows and stuff.
(Screen 1, User clicks there, this popup happens etc etc)


###Before you start

* Open documentation

([rambda](http://ramdajs.com/docs/),
[jasmine-test](http://jasmine.github.io/edge/introduction.html),
[JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects)
[HTML and DOM](https://developers.whatwg.org/)

* Chose a good productive text editor/IDE

* Configure your keyboard with macros

###Cycle

1. Discuss and Think (what, why, how)
2. Edit code
3. Write tests that run against new code written if that makes sense
4. Lint
5. Check the [checklist](checklist.md)
6. Commit your changes
7. Drink water
8. Pause at least 5 minutes (no screens, walk, breath)


###End/Production

Optimize, decorate, enhance

Minify files, build bundles, browserify.
You can include minifying in the cycle if you and your team knows about source maps.

[Babel](http://babeljs.io/) for transpiling.


##Are you completely new to JavaScript ?

Learn how JavaScript work first, then come back. Here are some good links:

* [Eloquent Javascript](http://eloquentjavascript.net/) ❤
* [Design Patterns](http://addyosmani.com/resources/essentialjsdesignpatterns/book/) ❤
* [Javascript-allongé](https://leanpub.com/javascript-allonge/read)
* [webplatform.org](http://www.webplatform.org/)
* [jstherightway](http://jstherightway.org/#getting-started)
* [A_re-introduction_to_JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A re introduction to JavaScript)
* [Crockford on JavaScript - Section 8: Programming Style & Your Brain ](https://www.youtube.com/watch?v=taaEzHI9xyY)[video]
* [My JavaScript examples](https://github.com/GrosSacASac/JavaScript-Set-Up/tree/master/js/examples)



###License

This project is free and open source. [See License](LICENSE.txt)

_imported programs_ however, may have other licenses:

[Jasmine license (MIT)](https://github.com/jasmine/jasmine/blob/master/MIT.LICENSE)

