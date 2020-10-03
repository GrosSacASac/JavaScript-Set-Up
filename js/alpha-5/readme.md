# alpha-5

5 bit text encoding and decoding.

## allowed charachters

a-z and a few extras see deep.js EXTRAS content

## format

- 1 byte for the number of bytes required to indicate the length of the text
- maybe 1 -3 byte of space (issue)
- The length of the text in characters (Big INT)
- The text