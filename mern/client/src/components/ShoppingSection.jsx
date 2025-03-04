// src/components/ShoppingSection.jsx
import React, {useContext} from "react";
import MaterialMenu from "./MaterialMenu";
import Button from "./UI/Button.jsx";
import CartContext from "../store/CartContext.jsx";
import UserProgressContext from "../store/UserProgressContext.jsx";
import Navbar from "react-bootstrap/Navbar";

export default function ShoppingSection({
                                            variations,
                                            config,
                                            onSelectVariation,
                                            selectedMaterial,
                                        }) {
    const cartContext = useContext(CartContext);

    const cartCtx = useContext(CartContext);
    const userProgressCtx = useContext(UserProgressContext);

    const totalCartItems = cartCtx.items.reduce((totalNumberOfItems, item) => {
        return totalNumberOfItems + item.quantity;
    }, 0);

    function handleShowCart() {
        userProgressCtx.showCart();
    }


    function handleAddItemToCart() {
        if (selectedMaterial) {
            cartContext.addItem(selectedMaterial);
        } else {
            console.log("No material selected to add to cart.");
        }
    }

    return (
        <div>
            <div className="variation-menu p-3">
                {variations && variations.length > 0 ? (
                    <MaterialMenu
                        variations={variations}
                        config={config}
                        onMaterialSelect={onSelectVariation}
                    />
                ) : (
                    <p>No variations available</p>
                )}
            </div>
            <div className="selected-material">
                <p>
                    Currently selected material:{" "}
                    {selectedMaterial ? selectedMaterial.name : "None"}
                </p>
            </div>
            <div>
                <p>
                    Price:{" "}
                    {selectedMaterial && selectedMaterial.price !== null
                        ? `$${selectedMaterial.price.toFixed(2)}`
                        : "Not available"}
                </p>
            </div>
            <div>

            </div>
            <div>
                <Button onClick={handleAddItemToCart}>Add to Cart</Button>
                <Button textOnly onClick={handleShowCart}> Cart ({totalCartItems})</Button>
                <Navbar.Brand as={Button} onClick={handleShowCart} textOnly={true} href="#" className="fs-3">
                </Navbar.Brand>

            </div>
        </div>
    );
}
