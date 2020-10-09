export {
    // public
    encode, decode,
    LETTER_LENGTH, ALPHABET_LENGTH,
    // private
    _0To31NumberFromCharacter,
    _0To31NumbersFromString,
    _compactUInt8ArrayFrom0To31Numbers,
};


const UTF_OFFSET_A = 97;
const ALPHABET_LENGTH = 26;
const EXTRAS = [
    ` `,
    `.`,
    `,`,
    `?`,
    `\n`,
    undefined, // empty
];
const LETTER_LENGTH = 5;
const BYTE_LENGTH = 8;

const _0To31NumberFromCharacter = character => {
    const numberRepresentation = character.charCodeAt(0) - UTF_OFFSET_A;
    if (numberRepresentation >= ALPHABET_LENGTH || numberRepresentation < 0) {
        if (EXTRAS.includes(character)) {
            return EXTRAS.indexOf(character) + ALPHABET_LENGTH;
        }
        return undefined;
    }
    return numberRepresentation;
};

const _0To31NumbersFromString = string => {
    return string.split(``).map(_0To31NumberFromCharacter).filter(number => {
        return number !== undefined;
    });
};

const stringFrom0To31Numbers = numbers => {
    return numbers.map(numberRepresentation => {
        if (numberRepresentation >= ALPHABET_LENGTH) {
            return EXTRAS[numberRepresentation - ALPHABET_LENGTH];
        }
        return String.fromCharCode(numberRepresentation + UTF_OFFSET_A);
    }).join(``);
};

const addNumberIntoByte = (number, existingByte = 0, offset, BitLength = LETTER_LENGTH) => {

};

const _compactUInt8ArrayFrom0To31Numbers = _0To31Numbers => {
    const byteLength = Math.ceil((_0To31Numbers.length * LETTER_LENGTH) / BYTE_LENGTH);
    const compactUInt8Array = new Uint8Array(byteLength);

    let bitPosition = 0;
    let numberToBeSaved = 0;
    let byteIndex = 0;
    
    const saveByte = (number) => {
        //console.log(`save ${number} (${number.toString(2).padStart(8, "0")})`)
        compactUInt8Array[byteIndex] = number;
        byteIndex += 1;
        numberToBeSaved = 0;
        bitPosition = 0;
    };
    _0To31Numbers.forEach(number => {
        if (bitPosition + LETTER_LENGTH < BYTE_LENGTH) { // can fit at once
            const toShift = BYTE_LENGTH - LETTER_LENGTH - bitPosition;
            numberToBeSaved += number << toShift;
            bitPosition += LETTER_LENGTH;
            
            if (bitPosition +1 === BYTE_LENGTH) {
                saveByte(numberToBeSaved);
            }
        } else { // cannot fit at once
            const shiftRight = -BYTE_LENGTH + LETTER_LENGTH + bitPosition; // 2
            const spaceLeft = LETTER_LENGTH - shiftRight; // 3
            
            const firstHalfToAdd = number >> shiftRight;
            const secondHalf = number - (firstHalfToAdd << shiftRight)
            numberToBeSaved += firstHalfToAdd;
            
            saveByte(numberToBeSaved);
            
            numberToBeSaved += secondHalf << (BYTE_LENGTH -LETTER_LENGTH + spaceLeft);
            bitPosition += LETTER_LENGTH-spaceLeft; //3
        }
    });
    // todo handle all cases
    // console.log(90,numberToBeSaved)
    if (numberToBeSaved) {
        saveByte(numberToBeSaved);
    } //else {
        //     compactUInt8Array[byteIndex] = remainder;
        // }
    // console.log("3_compactUInt8ArrayFrom0To31Numbers RESULT",compactUInt8Array)
    return compactUInt8Array;
};

const _0To31NumbersFromCompactUInt8Array = compactUInt8Array => {
    const byteLength = compactUInt8Array.length;
    const _0To31Numbers = [];
    const enoughSpace = BYTE_LENGTH - LETTER_LENGTH;

    const masks = [
        0b11111111,
        0b01111111,
        0b00111111,
        0b00011111,
        0b00001111,
        0b00000111,
        0b00000011,
        0b00000001,
    ];
    let offset = 0;
    let remainder = 0;
    let bitsScanned = 0;
    compactUInt8Array.forEach((uInt8, i) => {
        console.log(i, uInt8, 'uInt8')
        while (offset !== BYTE_LENGTH && !(i === byteLength - 1 && offset > enoughSpace)) {
            if (LETTER_LENGTH - bitsScanned <= BYTE_LENGTH - offset) {
                let number;
                if (bitsScanned === 0) {
                    number = (uInt8 & masks[offset]) >> (enoughSpace - offset);
                    offset += LETTER_LENGTH;
                    // console.log(number, offset)
                    console.log(i, number, 'full')
                } else {
                    const scanning = LETTER_LENGTH - bitsScanned;
                    number = remainder + (uInt8 >> (BYTE_LENGTH - scanning));
                    offset += scanning;
                    console.log(i, number, 'rest', (uInt8 >> (BYTE_LENGTH - scanning)))
                    remainder = 0;
                    bitsScanned = 0;
                }
                _0To31Numbers.push(number);
            } else {
                bitsScanned = BYTE_LENGTH - offset;
                remainder = (uInt8 & masks[offset]) << (LETTER_LENGTH - bitsScanned);
                offset += bitsScanned;
                console.log(i, 'scanning +', remainder);
            }
        }
        offset = 0;
    });

    return _0To31Numbers;
};

const _bytesRequiredToSaveNumber = number => {
    // maybe there is a simpler way
    let bits = 0;
    let divided = number;
    while (divided > 0) {
        bits += 1;
        divided = divided >> 1;
    }
    const bytesRequired = Math.ceil(bits / BYTE_LENGTH);
    console.log("bits required", bits);
    console.log("bytes required", bytesRequired);
    return bytesRequired;
};

const _initializeUint8WithLength = characters => {
    const textBitLength = characters * LETTER_LENGTH;
    const textByteLength = Math.ceil(textBitLength / BYTE_LENGTH);
    const bytesRequiredForTextByteLength = _bytesRequiredToSaveNumber(textByteLength);
    let totalByteLength = 1 + bytesRequiredForTextByteLength + textByteLength;
    let ArrayConstructor;
    if (bytesRequiredForTextByteLength === 1) {
        ArrayConstructor = Uint8Array;
    } else if (bytesRequiredForTextByteLength === 2) {
        ArrayConstructor = Uint16Array;
        totalByteLength += 1; // see todo
    } else if (bytesRequiredForTextByteLength === 3) {
        console.warn(`unhandled case BYTE_LENGTH ${BYTE_LENGTH} === 3`);
    } else if (bytesRequiredForTextByteLength === 4) {
        ArrayConstructor = Uint32Array;
        totalByteLength += 3; // see todo
    } else if (bytesRequiredForTextByteLength > 4) {
        console.warn(`unhandled case BYTE_LENGTH ${BYTE_LENGTH} > 4`);
    }
    const uInt8WithLength = new Uint8Array(totalByteLength);
    uInt8WithLength[0] = bytesRequiredForTextByteLength;
    const tempArray = new ArrayConstructor(uInt8WithLength.buffer);
    // todo : solve problem this can leave empty spaces
    tempArray[1] = textByteLength;
    const offset = totalByteLength - textByteLength;
    return [uInt8WithLength, offset];
    
};


const _joinUint8Array = function (target, copyInto, byteOffset) {
    target.set(copyInto, byteOffset);
    return target;
};

const encode = string => {
    const { length } = string;
    const _0To31Numbers = _0To31NumbersFromString(string);
    const [uInt8WithLength, offset] = _initializeUint8WithLength(length);
    const uInt8Array = _compactUInt8ArrayFrom0To31Numbers(_0To31Numbers);
    return _joinUint8Array(uInt8WithLength, uInt8Array, offset);
};

const decode = uInt8Array => {
    const _0To31Numbers = _0To31NumbersFromCompactUInt8Array(uInt8Array);
    const string = stringFrom0To31Numbers(_0To31Numbers);
    return string;
};

// console.log(37,_compactUInt8ArrayFrom0To31Numbers([1,2,3]))
// console.log(38,Uint8Array.from([
    // 0b00001000, // 1-2
    // 0b10000110, // 2-3
// ]))
// console.log(encode('abc def zxw aaa zzz'));
// console.log(encode('a - z'));
// console.log(encode('a'));
// console.log(encode('ab'));
// console.log(encode('z'));
// console.log(encode('aa'));
// console.log(encode('zz'));
// console.log(encode('\n\n'));

// console.log(decode(encode('a')));
// console.log(decode(encode('z')));
// console.log(decode(encode('?')));

// console.log(decode(encode('aa')));
// console.log(decode(encode('a - z')));
// console.log()
// console.log()
// console.log(decode(encode('abc def zxw aaa zzz')));
// console.log()
// console.log()
// console.log(decode(encode('ab   ')));
