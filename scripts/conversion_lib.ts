export const convertInteger = (
  input: string,
  radixFrom: number,
  radixTo: number
): string | null => {
  const partialDigits = partialDigitString(radixFrom);
  const bigRadix = BigInt(radixFrom);

  let result = 0n;
  let index = 0;
  let sign = "";

  // check for sign
  switch (input[0]) {
    case "-":
      sign = "-";
      index = 1;
      break;
    case "+":
    default:
      sign = "";
  }

  while (index < input.length) {
    const digit = partialDigits.indexOf(input[index]);
    if (digit === -1) {
      return null;
    }
    result = result * bigRadix + BigInt(digit);
    index++;
  }

  return sign + result.toString(radixTo);
};

const DIGITS =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/";

const partialDigitString = (radix: number): string => {
  return DIGITS.substr(0, radix);
};
