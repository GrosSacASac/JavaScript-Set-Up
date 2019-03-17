export { isObject };

const isObject = x => {
	return typeof x === `object` && x !== null;
}