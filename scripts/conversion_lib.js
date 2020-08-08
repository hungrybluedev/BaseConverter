export const convertInteger = (input, radixFrom, radixTo) => {
    const resultOrNull = parseBigIntFromRadix(input, radixFrom);
    if (!resultOrNull) {
        return null;
    }
    let result = resultOrNull;
    return convertBigIntToRadix(result, radixTo);
};
const parseBigIntFromRadix = (input, radix) => {
    let result = 0n;
    let index = 0;
    let sign = 1n;
    switch (input[0]) {
        case "-":
            sign = -1n;
            index = 1;
            break;
        case "+":
        default:
            sign = 1n;
    }
    const partialDigitsFrom = partialDigitString(radix);
    const bigRadixFrom = BigInt(radix);
    while (index < input.length) {
        const digit = partialDigitsFrom.indexOf(input[index]);
        if (digit === -1) {
            return null;
        }
        result = result * bigRadixFrom + BigInt(digit);
        index++;
    }
    return sign * result;
};
const convertBigIntToRadix = (result, radix) => {
    let convertedArray = [];
    const partialDigitsTo = partialDigitString(radix);
    const bigRadixTo = BigInt(radix);
    while (result > 0) {
        const digit = Number(result % bigRadixTo);
        convertedArray.unshift(partialDigitsTo[digit]);
        result /= bigRadixTo;
    }
    return convertedArray.join("");
};
export const numericInputIsValid = (numericString, radix) => {
    let index = 0;
    switch (numericString[0]) {
        case "-":
        case "+":
            index = 1;
            break;
        default:
            break;
    }
    if (radix < 2 || radix > DIGITS.length) {
        return false;
    }
    const partialDigitArray = DIGITS.substring(0, radix);
    for (; index < numericString.length; index++) {
        if (partialDigitArray.indexOf(numericString[index]) < 0) {
            return false;
        }
    }
    return true;
};
export const DIGITS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/";
const partialDigitString = (radix) => {
    return DIGITS.substr(0, radix);
};
