import {useState} from "react";


export default function Signup() {

    const [passwordsAreNotEqual, setPasswordsAreNotEqual] = useState(false);
    const [didEdit, setDidEdit] = useState(false);

    const [enteredValues, setEnteredValues] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
        street: "",
        streetNumber: "",
        city: ""
    });

    function handleSubmit(event) {
        event.preventDefault();
        setEnteredValues({
            email: "",
            password: "",
            confirmPassword: "",
            firstName: "",
            lastName: "",
            street: "",
            streetNumber: "",
            city: ""
        })

        if(enteredValues.confirmPassword !== enteredValues.password){
            setPasswordsAreNotEqual(true);
        }

    }

    function handleInputChange(identifier, value) {
        setEnteredValues(prevValues => ({
            ...prevValues,
            [identifier]: value
        }))
    }
    function handleInputBlur (identifier) {
        setDidEdit(prevEdit => ({
            ...prevEdit,
            [identifier]: true
        }))
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Welcome on board!</h2>
            <p>We just need a little bit of data from you to get you started 🚀</p>

            <div className="control">
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    name="email"
                    onBlur={()=> handleInputBlur("email")}
                    onChange={(event) => handleInputChange("email", event.target.value)}
                    value={enteredValues.email}
                    required
                />
            </div>

            <div className="control-row">
                <div className="control">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                           type="password"
                        name="password"
                        onBlur={()=> handleInputBlur("password")}
                        onChange={(event) => handleInputChange("password", event.target.value)}
                        value={enteredValues.password}
                        required
                        minLength={6}
                        autoComplete="current-password"
                    />
                </div>

                <div className="control">
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <input
                        id="confirm-password"
                        type="password"
                        name="confirm-password"
                        onBlur={()=> handleInputBlur("confirmPassword")}
                        onChange={(event) => handleInputChange("confirmPassword", event.target.value)}
                        value={enteredValues.confirmPassword}
                        autoComplete="current-password"
                        required
                    />
                    <div className="control-error">{passwordsAreNotEqual && <p>Passwords must match.</p>}</div>
                </div>
            </div>

            <hr/>

            <div className="control-row">
                <div className="control">
                    <label htmlFor="first-name">First Name</label>
                    <input
                        type="text"
                        id="first-name"
                        name="first-name"
                        onBlur={()=> handleInputBlur("firstName")}
                        onChange={(event) => handleInputChange("firstName", event.target.value)}
                        value={enteredValues.firstName}
                        required
                    />
                </div>

                <div className="control">
                    <label htmlFor="last-name">Last Name</label>
                    <input
                        type="text"
                        id="last-name"
                        name="last-name"
                        onBlur={()=> handleInputBlur("lastName")}
                        onChange={(event) => handleInputChange("lastName", event.target.value)}
                        value={enteredValues.lastName}
                        required
                    />
                </div>
            </div>

            <div className="control-row">
                <div className="control">
                    <label htmlFor="street">street</label>
                    <input
                        type="text"
                           id="street"
                           name="street"
                        onBlur={()=> handleInputBlur("street")}
                        onChange={(event) => handleInputChange("street", event.target.value)}
                        value={enteredValues.street}
                        required
                    />
                </div>

                <div className="control">
                    <label htmlFor="street-number">number</label>
                    <input
                        type="text"
                        id="street-number"
                        name="street-number"
                        onBlur={()=> handleInputBlur("streetNumber")}
                        onChange={(event) => handleInputChange("streetNumber", event.target.value)}
                        value={enteredValues.streetNumber}
                        required
                    />
                </div>

                <div className="control">
                    <label htmlFor="city">city</label>
                    <input
                        type="text"
                        id="city"
                        name="city"
                        onBlur={()=> handleInputBlur("city")}
                        onChange={(event) => handleInputChange("city", event.target.value)}
                        value={enteredValues.city}
                        required
                    />
                </div>
            </div>

            <div className="control">
                <label htmlFor="terms-and-conditions">
                    <input type="checkbox" id="terms-and-conditions" name="terms" required/>I
                    agree to the terms and conditions
                </label>
            </div>

            <p className="form-actions">
                <button type="reset" className="button button-flat">
                    Reset
                </button>
                <button type="submit" className="button">
                    Sign up
                </button>
            </p>
        </form>
    );
}