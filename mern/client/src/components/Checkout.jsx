import Modal from "./UI/Modal.jsx";
import cartContext from "../store/CartContext.jsx";
import {useContext, useState} from "react";
import Input from "./Input.jsx";
import Button from "./UI/Button.jsx";
import UserProgressContext from "../store/UserProgressContext.jsx";

//TODO: CREATE CURRENCY FORMATTER
//TODO: Check Signup for better ways to handle inputs

export default function Checkout () {

    const cartCtx = useContext(cartContext)
    const cartTotal = cartCtx.items.reduce(
        (totalPrice, item) => totalPrice + item.quantity,
        0
    );
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

    const userProgressCtx = useContext(UserProgressContext);

    function handleClose (){
        userProgressCtx.hideCheckout();
    }

    function handleSubmit (event) {
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

        }

    return (
        <Modal open={userProgressCtx.progress === "checkout"}>
            <form onSubmit={handleSubmit}>
                <h2>Checkout</h2>
                <p>Total Amount: {cartTotal} </p>
                <Input label="Firstname" id="firstName" type="text"/>
                <Input label="Lastname" id="lastName" type="text"/>
                <Input label="Email Address" id="email" type="text"/>
                <Input label="Street" id="street" type="text"/>
                <div className="control-row">
                    <Input label="Postal Code" id="postal_code" type="text" />
                    <Input label="City" id="city" type="text" />
                </div>

                <p className="modal-actions">
                    <Button textOnly type="button" onClick={handleClose}>Close</Button>
                    <Button>Submit Order</Button>
                </p>
            </form>
        </Modal>
    )
}