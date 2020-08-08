import {
  DIGITS,
  numericInputIsValid,
  removeDigitSeparatorsFrom,
  convertInteger,
} from "./conversion_lib.js";

/**
 * Helper function that retrieves the value of the input field with the specified ID.
 * In case there is no value present, it returns the default value passed to it.
 *
 * @param id The id of the input field to retrieve data from.
 * @param defaultValue The default value to be supplied if there is no data present.
 */
const getStringValueFromInput = (id: string, defaultValue: string): string => {
  const valueOrNull = document.getElementById(id);
  if (!valueOrNull) {
    return defaultValue;
  }
  const value = valueOrNull as HTMLInputElement;
  return value.value || defaultValue;
};

/**
 * Helper method that ensures that the radix provided is within the supported range.
 * If it is, there is no side effect. If it is not, an error is reported.
 *
 * @param name The input field that contains the incorrect radix value.
 * @param radix The value of radix to check.
 */
const reportIfIncorrectRadix = (name: string, radix: number) => {
  if (radix < 2 || radix > DIGITS.length) {
    reportError(
      "The " +
        name +
        " base should be between 2 and " +
        DIGITS.length +
        " inclusive. " +
        radix +
        " is invalid."
    );
  }
};

/**
 * Returns the string value obtained from the source (from) radix/base input field.
 */
const getSourceBase = (): number => {
  const numericString = getStringValueFromInput("source-base", "10");
  const intValue = parseInt(numericString);
  reportIfIncorrectRadix("source", intValue);
  return intValue;
};

/**
 * Returns the string value obtained from the target (to) radix/base input field.
 */
const getTargetBase = (): number => {
  const numericString = getStringValueFromInput("target-base", "16");
  const intValue = parseInt(numericString);
  reportIfIncorrectRadix("target", intValue);
  return intValue;
};

/**
 * Tries to obtain the string value of the main input, the source and target bases,
 * validates them, performs the parsing and conversion and returns the converted string.
 *
 * In case any of these steps fail, the first error encountered will be reported, and null
 * will be returned.
 */
const getConvertedResult = (): string | null => {
  const numericString = getStringValueFromInput("source-value", "");
  if (!numericString) {
    reportError("Please enter a value for the source.");
    return null;
  }
  const radixFrom = getSourceBase();
  const radixTo = getTargetBase();
  if (errorDisplayDiv.classList.contains("active-error-div")) {
    // Error occurred while trying to retrieve source value
    return null;
  }
  if (numericInputIsValid(numericString, radixFrom)) {
    const pureNumericString = removeDigitSeparatorsFrom(numericString);
    return convertInteger(pureNumericString, radixFrom, radixTo);
  } else {
    reportError(
      "The input is not valid for the given radix (base): " + radixFrom
    );
    return null;
  }
};

/**
 * The method called when the convert button is clicked (activated).
 *
 * 1. Clears the error present (if any).
 * 2. Tries to convert the result.
 * 3. If an error occurred, exit.
 * 4. If everything was fine, display the converted result.
 */
const calculateResult = () => {
  // Clear any error present currently.
  if (errorDisplayDiv.classList.contains("active-error-div")) {
    clearError();
  }
  // Try to obtain the value presented by the user
  const convertedResult = getConvertedResult();

  // Check again for potential error
  if (errorDisplayDiv.classList.contains("active-error-div")) {
    // Error occurred while trying to retrieve source value
    return;
  }
  if (convertedResult) {
    result.innerHTML = convertedResult;
  }
};

const clearError = () => {
  errorDisplayDiv.classList.remove("active-error-div");
  infoIcon.classList.remove("visible");
  infoIcon.classList.add("hidden");
  errorDisplayText.innerHTML = "";
};

const reportError = (message: string) => {
  if (errorDisplayDiv.classList.contains("active-error-div")) {
    // Don't overwrite an existing error.
    return;
  }
  errorDisplayDiv.classList.add("active-error-div");
  infoIcon.classList.add("visible");
  infoIcon.classList.remove("hidden");
  errorDisplayText.innerText = message;
};

const convertButton = document.getElementById(
  "convert-button"
) as HTMLButtonElement;

convertButton.addEventListener("click", calculateResult);

const errorDisplayDiv = document.getElementById("error-div") as HTMLDivElement;
const infoIcon = document.getElementById("info-icon") as HTMLSpanElement;
const errorDisplayText = document.getElementById(
  "error-text"
) as HTMLParagraphElement;

clearError();

const result = document.getElementById("result") as HTMLDivElement;
