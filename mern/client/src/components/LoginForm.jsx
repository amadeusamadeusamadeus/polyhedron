import Input from "./Input";
import { isEmail, isNotEmpty, hasMinLength } from "../utility/validation.js";
import { useInput } from "../hooks/useInput.js";

export default function LoginForm() {

    const {
        value: emailValue,
        handleInputChange: handleEmailChange,
        handleInputBlur: handleEmailBlur,
        hasError: emailHasError,
        reset: resetEmail
    } = useInput("", (value)=> isEmail(value) && isNotEmpty(value));

    const {
        value: passwordValue,
        handleInputChange: handlePasswordChange,
        handleInputBlur: handlePasswordBlur,
        hasError: passwordHasError,
        reset: resetPassword
    } =  useInput("", (value)=> hasMinLength(value, 6));

    function handleSubmit(event) {
        event.preventDefault();

        if(emailHasError || passwordHasError){
        }

        console.log("User entered:", { email: emailValue, password: passwordValue });

        resetEmail();
        resetPassword();
    }


    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <div className="control-row">
                <Input label="Email"
                       id="email"
                       type="email"
                       name="email"
                       onBlur={handleEmailBlur}
                       onChange={handleEmailChange}
                       value={emailValue}
                       error={emailHasError && "Please enter a valid email address."}
                       required
                />

                <Input label="Password" id="password" type="password" name="password"
                       onBlur={handlePasswordBlur}
                       onChange={handlePasswordChange}
                       value={passwordValue}
                       error={passwordHasError && "Password needs to be at least 6 characters long."}
                       minLength={6}
                       required/>
            </div>

            <p className="form-actions">
                <button className="button button-flat type" type="reset">Reset</button>
                <button className="button">Login</button>
            </p>
        </form>
    );
}
