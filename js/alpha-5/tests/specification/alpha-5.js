import test from "ava";
import { 
    encode, decode, BIT_LENGTH,// public
    _0To31NumberFromCharacter,
    _0To31NumbersFromString,
    _compactUInt8ArrayFrom0To31Numbers,
} from "../../alpha-5.js";
import { deepEqualAdded } from "../../deep.js";


test(`_0To31NumberFromCharacter a`, t => {
    t.is(_0To31NumberFromCharacter('a'), 0);
});
test(`_0To31NumberFromCharacter b`, t => {
    t.is(_0To31NumberFromCharacter('b'), 1);
});
test(`_0To31NumberFromCharacter z`, t => {
    t.is(_0To31NumberFromCharacter('z'), 25);
});

test(`_0To31NumberFromCharacter az`, t => {
    t.deepEqual(_0To31NumbersFromString('az'), [0,25]);
});

test(`_0To31NumberFromCharacter discards character out of range`, t => {
    t.deepEqual(_0To31NumbersFromString('aàz'), [0,25]);
});

test(`_compactUInt8ArrayFrom0To31Numbers 0`, t => {
    t.deepEqual(_compactUInt8ArrayFrom0To31Numbers([0]), new Uint8Array([0b0]));
});
test(`_compactUInt8ArrayFrom0To31Numbers 25`, t => {
    t.deepEqual(_compactUInt8ArrayFrom0To31Numbers([25]), new Uint8Array([0b11001000]));
});
test(`_compactUInt8ArrayFrom0To31Numbers 25, 25`, t => {    
    t.deepEqual(_compactUInt8ArrayFrom0To31Numbers([25, 25]), new Uint8Array([0b11001110,0b01000000]));
});

test(`_compactUInt8ArrayFrom0To31Numbers 
1, 00001
2, 00010
3, 00011`, t => {
    t.deepEqual(_compactUInt8ArrayFrom0To31Numbers(
        [1,2,3]
    ), Uint8Array.from([
        0b00001000, // 1-2
        0b10000110, // 2-3
        
    ]));
});

test(`_compactUInt8ArrayFrom0To31Numbers 
    1, 00001
    2, 00010
    3, 00011
    4, 00100
    5, 00101
    6, 00110
    7, 00111
    8, 01000`, t => {

        console.log(37,_compactUInt8ArrayFrom0To31Numbers([1,2,3,4,5,6,7,8
        ]))
        console.log(38,Uint8Array.from([
            0b00001000, // 1-2
            0b10000110, // 2-3-4
            0b01000010, // 4-5
            0b10011000, // 5-6-7
            0b11101000, // 7-8
        ]))
        
    t.deepEqual(_compactUInt8ArrayFrom0To31Numbers([1,2,3,4,5,6,7,8
    ]), Uint8Array.from([
        0b00001000, // 1-2
        0b10000110, // 2-3-4
        0b01000010, // 4-5
        0b10011000, // 5-6-7
        0b11101000, // 7-8
    ]));
    
});
/*
*/