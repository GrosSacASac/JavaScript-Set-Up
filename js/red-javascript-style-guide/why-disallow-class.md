# Why disallow the class keyword ?

## Problems with the class keywords

### A certain amount of additional vocabulary

`this`, `bind`, `call`, `apply`, `class`, `prototype`, `super`, `new`, `extends`, `Object.create`, `Object.setPrototypeOf`, `Object.getPrototypeOf`, `__proto__`, `instanceof`, `typeof`, `.prototype.isPrototypeOf` The mental overhead is there.

### Not transerrable in between realms

Web Worker, Local Storage, Browser, Server. An instance of a class transferred will lose its prototype chain. In order to use the class methods with the instance one has to reinstanciate which requires extra code compared to the plain object alternative.

### Compatibilty with higher-order functions

It is harder to use higher-order function with the class keyword than it is with regular functions. Regular functions can be mixed, composed, curried etc. Overall it results in a implentation flexibility loss.

### class and implicit code 

Explicit code is generally easier to read and understand.

### Encourages a pure OOP mental model

When using the class keyword I tend to think in an everything-is-an-object mental model, which is less flexible than the data-oriented mental model.



### class forces the calling code to use new

Which is a leaking implementation detail.


## Non-Alternative

I don't consider using the old syntax (e.g with .prototype) a good alternative as it has the same problems and is more verbose.

## Alternative

First, there needs to be a true viable alternative.

### contructor/creator

With the class keyword an empty object is implicitly created and the `this` becomes it, and `this` is implicitly returned. It turns out, that any function can create an object and return it too. A creator function can also return a `Map` or a `Set` etc.

```js
const createHero = ({ name }) => {
    const hero = {
        name,
        hitPoints: 100,
        location: [0, 0],
        favouriteAttack: undefined,
    };
    
    return hero;
};

const hero = createHero({ name: `Superjhemp` });
```

### method

With the class keyword, each instance has a prototype chain. And the `this` is set implicitly based on what is before the dot. With function-based syntax the instance is passed explicitly as first parameter to the function.

```js
const moveHero = (hero, [x, y]) => {
    const [pastX, pastY] = hero.location;
    hero.location = [pastX + x, pastY + y];
};


moveHero(hero, [5, 20]);
```

### composition (has-a)

It is practically the same as with the class keyword:

```js
const createCar = ({ id }) => {
    const car = {
        id,
        engine: createElectricEngine(),
        structure: createCarStructure(),
    };
    
    return car;
};
```


### inheritance (subtype-of)

Call the parent creator then, add, change and remove properties. Do not remove properties to respect the subsitution principle.


```js
const createMultiverseHero = ({ name, currentUniverse = 1 }) => {
    const multiverseHero = Object.assign(createHero({ name }), {
        // additional properties
        currentUniverse,
        concentrationLevel: 40,
    });

    // removed
    delete multiverseHero.favouriteAttack;

    // changed
    multiverseHero.hitPoints *= 2;
    
    return hero;
};

const multiverseHero = createMultiverseHero({ name: `Jace` });

// add methods
const changeUniverse = (multiverseHero, universe) => {
    hero.concentrationLevel -= 20;
    hero.currentUniverse = universe;
};

// change existing
const moveMultiverseHero = (multiverseHero, position) => {
    // do something before or after
    moveHero(multiverseHero, position);
    hero.concentrationLevel -= 1;
};

changeUniverse(multiverseHero, 2);
moveMultiverseHero(multiverseHero, [5, 20]);
// reusing parent methods
moveHero(multiverseHero, [12, 24]);
```

### composition (mix)

Similar to Python multiple-inheritance a mix allows to create a class that produces objects with a flat tree. Same technique as for inheritance using Object.assign, last object "wins".

```js
const createAnimalWithWings = ({ altitude = 10 }) => {
    return {
        altitude,
    };
};

const flyUp = (animalWithWings) => {
    animalWithWings.altitude += 1;
};

const createAnimalWithHunger = ({ hunger = 0.5 }) => {
    return {
        hunger,
    };
};

const eat = (animalWithHunger) => {
    console.log(`crunch`);
    animalWithHunger.hunger -= 0.1;
};

const createBird = (options = {}) => {
    return Object.assign(
        createAnimalWithWings(options),
        createAnimalWithHunger(options),
    );
};

// convenience
const Bird = {
    create: createBird,
    eat,
    flyUp,
};

const bird = Bird.create();
Bird.eat(bird); // crunch
Bird.flyUp(bird);
console.log(bird); //  { altitude: 11, hunger: 0.4 }
```

[Here's another example - class7.js](https://github.com/GrosSacASac/JavaScript-Set-Up/blob/master/js/class/class7.js)

### privates

Create private members by using a symbol as a key or storing privates on a WeakMap that is not exported.

With non-exported symbols:

```js
const hitPoints = Symbol();
const location = Symbol();

const createHero = ({ name }) => {
    const hero = {
        name,
        [hitPoints]: 100,
        [location]: [0, 0],
    };
    
    return hero;
};

const moveHero = (hero, [x, y]) => {
    const [pastX, pastY] = hero[location];
    hero[location] = [pastX + x, pastY + y];
};
```

With non-exported WeakMap:

```js
const heroPrivates = new WeakMap();

const createHero = ({ name }) => {
    const hero = {
        name,
    };
    heroPrivates.set(hero, {
        hitPoints: 100,
        location: [0, 0],
    });
    
    return hero;
};

const moveHero = (hero, [x, y]) => {
    const [pastX, pastY] = heroPrivates.get(hero).location;
     heroPrivates.get(hero).location = [pastX + x, pastY + y];
};
```



## Other Alternatives

There are other alternatives on how to use objects in JS.

 * [stamps](https://github.com/stampit-org/stampit)
 * [using closures (video)](https://vimeo.com/97419177)

## Reasons to still use the class keyword

 * Consistency with rest of the code
 * Refactoring cost higher than the rewards

## [← Back to full guide](https://github.com/GrosSacASac/JavaScript-Set-Up/tree/master/js/red-javascript-style-guide)
