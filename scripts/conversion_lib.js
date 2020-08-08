export const DIGITS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/";
const getPartialDigitString = (radix) => {
    return DIGITS.substr(0, radix);
};
export const convertInteger = (input, radixFrom, radixTo) => {
    if (radixFrom === radixTo) {
        return input;
    }
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
    const partialDigitsFrom = getPartialDigitString(radix);
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
const convertBigIntToRadix = (integer, radix) => {
    let convertedArray = new Array();
    const partialDigitsTo = getPartialDigitString(radix);
    const bigRadixTo = BigInt(radix);
    const isNegative = integer < 0n;
    let absoluteValue = isNegative ? -integer : integer;
    while (absoluteValue > 0n) {
        const digit = Number(absoluteValue % bigRadixTo);
        convertedArray.unshift(partialDigitsTo[digit]);
        absoluteValue /= bigRadixTo;
    }
    return (isNegative ? "-" : "") + convertedArray.join("");
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
    let decimalFound = false;
    for (; index < numericString.length; index++) {
        const character = numericString[index];
        switch (character) {
            case "_":
            case ",":
                break;
            case ".":
                if (decimalFound) {
                    return false;
                }
                else {
                    decimalFound = true;
                }
                break;
            default:
                if (partialDigitArray.indexOf(character) < 0) {
                    return false;
                }
        }
    }
    return true;
};
export const removeDigitSeparatorsFrom = (input) => {
    return input.replace(/[_,]/g, "");
};
