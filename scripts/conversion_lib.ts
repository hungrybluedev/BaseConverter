export const DIGITS =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/";

/**
 * Returns a string containing the subset of digits allowed for the specified radix.
 *
 * @param radix The radix against which the legal digits are generated.
 */
const getPartialDigitString = (radix: number): string => {
  return DIGITS.substr(0, radix);
};

/**
 * Takes a (valid) numeric integer string and converts from the given radix
 * to the specified radix. The radices are not validated and expected
 * to lie in the range 2 (inclusive) to DIGITS.length (inclusive).
 *
 * A numeric string is a valid integer if:
 * 1. It has no leading sign, or just one leading "+" or "-".
 * 2. All the characters must be digits from 0 (inclusive) to radix (exclusive).
 * 3. Does not have digit separators. Use the `removeDigitSeparatorsFrom` function.
 *
 * @param input The numeric string to parse.
 * @param radixFrom The radix the given numeric value is in.
 * @param radixTo The radix we want to convert the numeric value to.
 */
export const convertInteger = (
  input: string,
  radixFrom: number,
  radixTo: number
): string | null => {
  // shortcut for cases when the bases are the same
  if (radixFrom === radixTo) {
    return input;
  }
  const resultOrNull = parseBigIntFromRadix(input, radixFrom);
  if (!resultOrNull) {
    return null;
  }
  let result = resultOrNull as bigint;
  return convertBigIntToRadix(result, radixTo);
};

/**
 * Returns a bigint from the given numeric string. It assumes that the string does
 * not have digit separators.
 *
 * @param input The cleaned numeric string to parse and obtain a bigint from.
 * @param radix The radix which will be used to decode the given input string.
 */
const parseBigIntFromRadix = (input: string, radix: number): bigint | null => {
  let result = 0n;
  let index = 0;
  let sign = 1n;

  // check for sign
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

/**
 * Converts the given bigint value to the requested radix.
 *
 * @param integer The integer to convert to the specified radix.
 * @param radix The target radix for conversion.
 */
const convertBigIntToRadix = (integer: bigint, radix: number): string => {
  let convertedArray = new Array<string>();
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

/**
 * Returns true if a numeric string is valid with respect to a given radix.
 * Returns false otherwise.
 *
 * In general, a numeric string is valid if:
 * 1. It has no leading sign, or just one leading "+" or "-".
 * 2. All the characters must be digits from 0 (inclusive) to radix (exclusive).
 * 3. Digit separators are allowed: `_` and `,`. These will be ignored when processed.
 *
 * @param numericString The string to validate.
 * @param radix The source radix to be used for validation.
 */
export const numericInputIsValid = (
  numericString: string,
  radix: number
): boolean => {
  let index = 0;

  // check for sign
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
  // We restrict ourselves to the subset of all the representable digits with given radix
  const partialDigitArray = DIGITS.substring(0, radix);

  let decimalFound = false;
  for (; index < numericString.length; index++) {
    const character = numericString[index];
    switch (character) {
      case "_":
      case ",":
        // valid separators
        break;
      case ".":
        if (decimalFound) {
          // decimal already found beforehand
          return false;
        } else {
          // mark that we've found a decimal point.
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

/**
 * Returns a numeric string with all (valid) digit separators removed.
 *
 * The valid digit separators are `_` and `,`.
 *
 * @param input The numeric string to remove separators from.
 */
export const removeDigitSeparatorsFrom = (input: string): string => {
  return input.replace(/[_,]/g, "");
};
