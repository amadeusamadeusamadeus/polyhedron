import React, {useContext} from "react";
import MaterialMenu from "./MaterialMenu";
import Button from "./UI/Button.jsx";
import CartContext from "../store/CartContext.jsx";
//TODO: create a proper object for the order, so you can add it to the cart instead of just the material name

export default function ShoppingSection({
                                            variations,
                                            config,
                                            onSelectVariation,
                                            selectedMaterial, // changed prop name here
                                        }) {
    const cartContext = useContext(CartContext);

    function handleAddItemToCart() {
        // Only add the item if it exists, otherwise do nothing or show a warning.
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
                        onSelectVariation={onSelectVariation}
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
                <p>€ 49,99</p>
                <Button onClick={handleAddItemToCart}>Add to Cart</Button>
            </div>
        </div>
    );
}
