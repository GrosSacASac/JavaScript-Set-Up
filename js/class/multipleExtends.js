export { multipleExtends };

/**
returns a class
constructors will be called in reversed orders with no immediate variable access
flat instance will be created
 */
const multipleExtends = (baseClass, ...others) => {
    if (!others.length) {
        return baseClass;
    }
    return assignMethods(class extends multipleExtends(...others) {
        constructor (...x) {
            super(...x);
            Object.assign(this, new baseClass(...x));
        }
    }, baseClass);
};

const assignMethods = (target, baseClass) => {
    const methodNames = Object.getOwnPropertyNames(baseClass.prototype).filter(name => {
        return name !== `constructor`;
    });
    methodNames.forEach(name => {
        target.prototype[name] = baseClass.prototype[name];
    });
    return target;
};
