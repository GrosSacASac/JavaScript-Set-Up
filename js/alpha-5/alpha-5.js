export { encode };


const UTF_OFFSET_A = 97;
const ALPHABET_LENGTH = 26;
const EXTRAS = [
    ` `,
    `.`,
    `,`,
    `?`,
    `!`,
    `\n`,
];
const BIT_LENGTH = 5;
const BYTE = 8;

const _0To31NumbersFromString = string => {
    return string.split(``).map(character => {
        const numberRepresentation = character.charCodeAt(0) - UTF_OFFSET_A;
        if (numberRepresentation >= ALPHABET_LENGTH || numberRepresentation < 0) {
            if (EXTRAS.includes(character)) {
                return EXTRAS.indexOf(character) + ALPHABET_LENGTH;
            }
            return undefined;
        }
        return numberRepresentation;
    }).filter(number => {
        return number !== undefined;
    });
};

const compactUInt8ArrayFrom0To31Numbers = _0To31Numbers => {
    const byteLength = Math.ceil((_0To31Numbers.length * BIT_LENGTH) / BYTE);
    const compactUInt8Array = new Uint8Array(byteLength);
    const enoughSpace = BYTE - BIT_LENGTH;

    let offset = 0;
    let remainder = 0;
    let byteIndex = 0;
    _0To31Numbers.forEach((number, i) => {
        if (offset <= enoughSpace) {
            remainder = number << (enoughSpace - offset);
            offset += BIT_LENGTH;
        } else {
            const toShift = BIT_LENGTH - (BYTE - offset);
            const nextOffset = BIT_LENGTH - toShift;
            const toAdd = number >> toShift;
            remainder += toAdd;

            compactUInt8Array[byteIndex] = remainder;
            byteIndex += 1;

            remainder = (number - toAdd) << nextOffset;
            offset = nextOffset;
        }
        if (i + 1 === _0To31Numbers.length) {
            compactUInt8Array[byteIndex] = remainder;
        }
    });

    return compactUInt8Array;
};

const encode = string => {
    const _0To31Numbers = _0To31NumbersFromString(string);
    const uInt8Array = compactUInt8ArrayFrom0To31Numbers(_0To31Numbers);
    return uInt8Array;
};

console.log(encode('abc def zxw aaa zzz'));
console.log(encode('a-z'));
console.log(encode('a - z'));
console.log(encode('a'));
console.log(encode('z'));
console.log(encode('aa'));
console.log(encode('zz'));
console.log(encode('\n'));
console.log(encode('\n\n'));