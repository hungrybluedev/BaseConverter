import { DIGITS, numericInputIsValid, removeDigitSeparatorsFrom, convertInteger, } from "./conversion_lib.js";
const getStringValueFromInput = (id, defaultValue) => {
    const valueOrNull = document.getElementById(id);
    if (!valueOrNull) {
        return defaultValue;
    }
    const value = valueOrNull;
    return value.value || defaultValue;
};
const reportIfIncorrectRadix = (name, radix) => {
    if (radix < 2 || radix > DIGITS.length) {
        reportError("The " +
            name +
            " base should be between 2 and " +
            DIGITS.length +
            " inclusive. " +
            radix +
            " is invalid.");
    }
};
const getSourceBase = () => {
    const numericString = getStringValueFromInput("source-base", "10");
    const intValue = parseInt(numericString);
    reportIfIncorrectRadix("source", intValue);
    return intValue;
};
const getTargetBase = () => {
    const numericString = getStringValueFromInput("target-base", "16");
    const intValue = parseInt(numericString);
    reportIfIncorrectRadix("target", intValue);
    return intValue;
};
const getConvertedResult = () => {
    const numericString = getStringValueFromInput("source-value", "");
    if (!numericString) {
        reportError("Please enter a value for the source.");
        return null;
    }
    const radixFrom = getSourceBase();
    const radixTo = getTargetBase();
    if (errorDisplayDiv.classList.contains("active-error-div")) {
        return null;
    }
    if (numericInputIsValid(numericString, radixFrom)) {
        const pureNumericString = removeDigitSeparatorsFrom(numericString);
        return convertInteger(pureNumericString, radixFrom, radixTo);
    }
    else {
        reportError("The input is not valid for the given radix (base): " + radixFrom);
        return null;
    }
};
const calculateResult = () => {
    if (errorDisplayDiv.classList.contains("active-error-div")) {
        clearError();
    }
    const convertedResult = getConvertedResult();
    if (errorDisplayDiv.classList.contains("active-error-div")) {
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
const reportError = (message) => {
    if (errorDisplayDiv.classList.contains("active-error-div")) {
        return;
    }
    errorDisplayDiv.classList.add("active-error-div");
    infoIcon.classList.add("visible");
    infoIcon.classList.remove("hidden");
    errorDisplayText.innerText = message;
};
const convertButton = document.getElementById("convert-button");
convertButton.addEventListener("click", calculateResult);
const errorDisplayDiv = document.getElementById("error-div");
const infoIcon = document.getElementById("info-icon");
const errorDisplayText = document.getElementById("error-text");
clearError();
const result = document.getElementById("result");
