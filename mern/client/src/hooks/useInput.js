// src/hooks/useInput.js
import { useState, useEffect } from "react";

export function useInput(defaultValue, validationFn) {
    const [enteredValue, setEnteredValue] = useState(defaultValue);
    const [didEdit, setDidEdit] = useState(false);

    const valueIsValid = validationFn(enteredValue);

    function handleInputChange(event) {
        setEnteredValue(event.target.value);
        setDidEdit(false);
    }

    function reset(newDefault = defaultValue) {
        setEnteredValue(newDefault);
        setDidEdit(false);
    }

    function handleInputBlur() {
        setDidEdit(true);
    }

    // Update the internal state if defaultValue changes.
    useEffect(() => {
        setEnteredValue(defaultValue);
    }, [defaultValue]);

    return { value: enteredValue, handleInputChange, handleInputBlur, hasError: didEdit && !valueIsValid, reset, setEnteredValue };
}
