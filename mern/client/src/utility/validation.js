export function isEmail (value) {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i;
    return emailRegex.test(value);
}

export function isNotEmpty(value) {
    return value.trim() !== "";
}

export function hasMinLength(value, minLength) {
    return value.length >= minLength;
}

export function isEqualsToOtherValue (value, otherValue) {
    return value === otherValue;
}