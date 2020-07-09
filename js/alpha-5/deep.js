export {
    deepCopy,
    deepCopyAdded,
    deepAssign,
    deepAssignAdded,
    deepEqual,
    deepEqualAdded,
    deepDifference,
};


/**
only works with undefined, null, Number, Symbol, String, Big Int, Object, Array,
warning
does not work with cyclic objects
does not work with anything created with new
*/
const deepCopy = x => {
    if (typeof x !== `object` || x === null) {
        return x;
    }

    if (Array.isArray(x)) {
        return x.map(deepCopy);
    }

    const copy = {};
    Object.entries(x).forEach(([key, value]) => {
        copy[key] = deepCopy(value);
    });

    return copy;
};

/**
like deepCopy but supports more types
works with
undefined, null, Number, Symbol, String, Big Int,
Object, Array,
Date, RegExp, Set, Map,
Uint8Array, Uint16Array, Uint32Array,
Int8Array, Int16Array, Int32Array

warning
does not work with cyclic object
does not copy internal links

*/
const deepCopyAdded = x => {
    if (typeof x !== `object` || x === null) {
        return x;
    }
    if (x instanceof Date) {
        return new Date(x);
    }
    if (x instanceof RegExp) {
        return new RegExp(x);
    }
    if (x instanceof Set) {
        return new Set(Array.from(x, deepCopyAdded));
    }
    if (x instanceof Map) {
        const map = new Map();
        // todo keep internal links
        x.forEach((value, key) => {
            map.set(deepCopyAdded(key), deepCopyAdded(value));
        });
        return map;
    }
    if (Array.isArray(x)) {
        return x.map(deepCopy);
    }
    if (ArrayBuffer.isView(x) && !(x instanceof DataView)) {
        return new x.constructor(x);
    }

    const copy = {};
    Object.entries(x).forEach(([key, value]) => {
        copy[key] = deepCopy(value);
    });

    return copy;
};


/**
Like Object.assign but deep,
does not try to assign partial arrays inside, they are overwritten
only works with undefined, null, Number, Symbol, String, Big Int, Object, Array,
warning
does not work with cyclic objects
does not work with anything created with new

@param {Object} target must be an object
@param {Object} source1 should be an object, silently discards if not (like Object.assign)

@return {Object} target
*/
const deepAssign = (target, ...sources) => {
    sources.forEach(source => {
        if (!source || typeof source !== `object`) {
            return;
        }
        Object.entries(source).forEach(([key, value]) => {
            if (key === `__proto__`) {
                return;
            }
            if (typeof value !== `object` || value === null) {
                target[key] = value;
                return;
            }
            if (Array.isArray(value)) {
                target[key] = [];
            }
            // value is an Object
            if (typeof target[key] !== `object` || !target[key]) {
                target[key] = {};
            }
            deepAssign(target[key], value);
        });
    });
    return target;
};


/**
Like deepAssign but supports more types,
does not try to assign partial arrays inside, they are overwritten
works with
undefined, null, Number, Symbol, String, Big Int,
Object, Array,
Date, RegExp, Set, Map,
Uint8Array, Uint16Array, Uint32Array,
Int8Array, Int16Array, Int32Array

warning
does not work with cyclic objects
does not copy internal links

@param {Object} target must be an object
@param {Object} source1 should be an object, silently discards if not (like Object.assign)

@return {Object} target
*/
const deepAssignAdded = (target, ...sources) => {
    sources.forEach(source => {
        if (!source || typeof source !== `object`) {
            return;
        }
        Object.entries(source).forEach(([key, value]) => {
            if (key === `__proto__`) {
                return;
            }
            if (typeof value !== `object` || value === null) {
                target[key] = value;
                return;
            }
            if (value instanceof Date) {
                target[key] = new Date(value);
                return;
            }
            if (value instanceof RegExp) {
                target[key] = new RegExp(value);
                return;
            }
            if (value instanceof Set) {
                let tempArray = Array.from(value, deepCopyAdded);
                if (target[key] instanceof Set) {
                    tempArray = tempArray.concat(Array.from(target[key]));
                }
                target[key] = new Set(tempArray);
                return;
            }
            if (value instanceof Map) {
                let map;
                if (target[key] instanceof Map) {
                    map = target[key];
                } else {
                    map = new Map();
                    target[key] = map;
                }
                // todo keep internal links
                value.forEach((intlValue, intlKey) => {
                    map.set(deepCopyAdded(intlKey), deepCopyAdded(intlValue));
                });
                return;
            }
            if (Array.isArray(value)) {
                target[key] = [];
            }
            if (ArrayBuffer.isView(value) && !(value instanceof DataView)) {
                target[key] = new value.constructor(value);
                return;
            }
            // value is an Object
            if (typeof target[key] !== `object` || !target[key]) {
                target[key] = {};
            }
            deepAssignAdded(target[key], value);
        });
    });
    return target;
};

/**
works with
undefined, null, Number, Symbol, String, Big Int,
Object, Array,

 * @param {Object} a can be either an object or array
 * @param {Object} b can be either an object or array
 * @returns {Boolean}
 */
const deepEqual = (a, b) => {
    if (a === b) {
        return true;
    }

    if (Array.isArray(a)) {
        if (!Array.isArray(b)) {
            return false;
        }

        if (a.length !== b.length) {
            return false;
        }

        return a.every((value, index) => {
            return deepEqual(value, b[index]);
        });
    }

    if (a.constructor !== b.constructor) {
        return false;
    }

    if (isObject(a) && isObject(b)) {
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);

        return (
            deepEqual(keysA, keysB) &&
            keysA.every(key => {
                return deepEqual(a[key], b[key]);
            })
        );
    }
    return false;
};

/**
works with
undefined, null, Number, Symbol, String, Big Int,
Object, Array,
Date, RegExp, Set, Map,
Uint8Array, Uint16Array, Uint32Array,
Int8Array, Int16Array, Int32Array

 * @param {Object} a can be either an object or array
 * @param {Object} b can be either an object or array
 * @returns {Boolean}
 */
const deepEqualAdded = (a, b) => {
    if (a === b) {
        return true;
    }

    if (a instanceof Date) {
        if (!(b instanceof Date)) {
            return false;
        }
        return (a.getTime() === b.getTime());
    }

    if (a instanceof RegExp) {
        if (!(b instanceof RegExp)) {
            return false;
        }
        return String(a) === String(b);
    }

    if (Array.isArray(a)) {
        if (!Array.isArray(b)) {
            return false;
        }
        return validateArrayLike(a, b);
    }


    if ((a instanceof Uint8Array) ||
        (a instanceof Uint16Array) ||
        (a instanceof Uint32Array) ||
        (a instanceof Int8Array) ||
        (a instanceof Int16Array) ||
        (a instanceof Int32Array)) {
        if (!(b instanceof a.constructor)) {
            return false;
        }
        return validateArrayLike(a, b);
    }

    if ((a instanceof Set)) {
        if (!(b instanceof Set)) {
            return false;
        }
        
        // Sets have size, not length
        const arr1 = Array.from(a);
        const arr2 = Array.from(b);
        return validateArrayLike(arr1, arr2);
    }

    if (a instanceof Map) {
        if (!(b instanceof Map)) {
            return false;
        }

        if (a.size !== b.size) {
            return false;
        }

        const keysA = a.keys();
        for (const key of keysA) {
            // todo don't check for strict equal key, use deepEqual
            if (!b.has(key) || !deepEqualAdded(a.get(key), b.get(key))) {
                return false;
            }
        }
        return true;
    }

    if (a.constructor !== b.constructor) {
        return false;
    }

    if (isObject(a) && isObject(b)) {
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);

        return (
            deepEqualAdded(keysA, keysB) &&
            keysA.every(key => {
                return deepEqualAdded(a[key], b[key]);
            })
        );
    }

    return false;
};

/**
 * @function deepDifference  finds the differences betwenn two objects
 * @param  {*}      obj1 The first object
 * @param  {*}      obj2 The second object
 * @var  {Object} deepDifferences contains the differences results
 * @return  {deepDifferences} returns an Object of differences
 */

const deepDifference = function(obj1, obj2) {
    if (!obj2 || typeof obj2 !== `object`) {
        return obj1;
    }

    const deepDifferences = {
        additions: [],
        removals: [],
        changes: [],
    };

    /**
     * @function compare two items and push non-matches to object
     * @param  {*}      item1 The first item
     * @param  {*}      item2 The second item
     * @param  {String} key   The key in our object
     *
     * Grab the object types for better comparison, since arrays by default return type object
     * @var {*} type1 the object type for the first item
     * @var {*} type2 the object type for the first item
     */
    const compare = function(item1, item2, key) {
        const type1 = Object.prototype.toString.call(item1);
        const type2 = Object.prototype.toString.call(item2);

        //if item2 has undefined type, assign null to its value
        if (type2 === `[object Undefined]`) {
            const nameArray = [];
            nameArray.push(key);
            const changed = { name: nameArray, oldValue: item1, newValue: null };
            deepDifferences.changes.push(changed);
            return;
        }
        
        //if object call deepDifference recursively
        if (type1 === `[object Object]`) {
            const nameArray = [];
            nameArray.push(key);
            const objdeepDifference = deepDifference(item1, item2);
            if (objdeepDifference.additions.length > 0) {
                nameArray.push(objdeepDifference.additions[0].name[0]);
                const added = {
                    name: nameArray,
                    value: objdeepDifference.additions[0].value,
                };
                deepDifferences.additions.push(added);
            }
            if (objdeepDifference.removals.length > 0) {
                nameArray.push(objdeepDifference.removals[0].name[0]);
                const removed = {
                    name: nameArray,
                    value: objdeepDifference.removals[0].value,
                };
                deepDifferences.removals.push(removed);
            }

            return;
        }

        //if function. convert to string and compare
        if (type1 === `[object Function]`) {
            if (item1.toString() !== item2.toString()) {
                const nameArray = [];
                nameArray.push(key);
                const changed = { name: nameArray, oldValue: item1, newValue: item2 };
                deepDifferences.changes.push(changed);
            }
        }

        if (type1 === `[object Array]`) {
            if (!arraysMatch(item1, item2)) {
                const nameArray = [];
                nameArray.push(key);
                const changed = { name: nameArray, oldValue: item1, newValue: item2 };
                deepDifferences.changes.push(changed);
            }
            return;
        }

        if (item1 !== item2) {
            const nameArray = [];
            nameArray.push(key);
            const changed = { name: nameArray, oldValue: item1, newValue: item2 };
            deepDifferences.changes.push(changed);
            return;
        }

        if (type1 !== type2) {
            const nameArray = [];
            nameArray.push(key);
            const changed = { name: nameArray, oldValue: item1, newValue: item2 };
            deepDifferences.changes.push(changed);
            return;
        }
    };

    Object.keys(obj1).forEach(key => {
        /**
         * If obj2 is missing a property in obj1
         * add property to removals array
         **/
        if (!{}.hasOwnProperty.call(obj2, key)) {
            const nameArray = [];
            nameArray.push(key);
            const removed = { name: nameArray, value: obj1[key] };
            deepDifferences.removals.push(removed);
            return;
        }
        compare(obj1[key], obj2[key], key);
    });

        Object.keys(obj2).forEach(key => {
        if (!{}.hasOwnProperty.call(obj1, key)) {
            const nameArray = [];
            nameArray.push(key);
            const added = { name: nameArray, value: obj2[key] };
            deepDifferences.additions.push(added);
            return;
        }
    });

    return deepDifferences;
};

const arraysMatch = function(arr1, arr2) {
    // Check if the arrays are the same length
    if (arr1.length !== arr2.length) {
        return false;
    }

    // Check if all items exist and are in the same order
    for (let i = 0; i < arr1.length; i = +1) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }

    // Otherwise, return true
    return true;
};

const isObject = x => {
    return typeof x === `object` && x !== null;
};

const validateArrayLike = (a, b) => {
    return (
        (a.length === b.length) &&
        (a.every((value, index) => {
            return deepEqualAdded(value, b[index]);
        }))
    );
};
