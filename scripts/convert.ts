import {
  DIGITS,
  numericInputIsValid,
  convertInteger,
} from "./conversion_lib.js";

const getStringValueFromInput = (id: string, defaultValue: string): string => {
  const valueOrNull = document.getElementById(id);
  if (!valueOrNull) {
    return defaultValue;
  }
  const value = valueOrNull as HTMLInputElement;
  return value.value || defaultValue;
};

const reportIfIncorrectBase = (name: string, value: number) => {
  if (value < 2 || value > DIGITS.length) {
    reportError(
      "The " +
        name +
        " base should be between 2 and " +
        DIGITS.length +
        " inclusive. " +
        value +
        " is invalid."
    );
  }
};

const getSourceBase = (): number => {
  const numericString = getStringValueFromInput("source-base", "10");
  const intValue = parseInt(numericString);
  reportIfIncorrectBase("source", intValue);
  return intValue;
};

const getTargetBase = (): number => {
  const numericString = getStringValueFromInput("target-base", "16");
  const intValue = parseInt(numericString);
  reportIfIncorrectBase("target", intValue);
  return intValue;
};

const getConvertedResult = (): string | null => {
  const numericString = getStringValueFromInput("source-value", "");
  if (!numericString) {
    return null;
  }
  const radixFrom = getSourceBase();
  const radixTo = getTargetBase();
  if (errorDisplayDiv.classList.contains("active-error-div")) {
    // Error occurred while trying to retrieve source value
    return null;
  }
  if (numericInputIsValid(numericString, radixFrom)) {
    return convertInteger(numericString, radixFrom, radixTo);
  } else {
    reportError(
      "The input is not valid for the given radix (base): " + radixFrom
    );
    return null;
  }
};

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
  } else {
    reportError("Please enter a value for the source.");
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
