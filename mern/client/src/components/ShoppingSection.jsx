// src/components/ShoppingSection.jsx
import React, { useContext } from "react";
import MaterialMenu from "./MaterialMenu";
import Button from "./UI/Button.jsx";
import CartContext from "../store/CartContext.jsx";

export default function ShoppingSection({
                                            variations,
                                            config,
                                            onSelectVariation,
                                            selectedMaterial,
                                        }) {
    const cartContext = useContext(CartContext);

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
                <p>
                    Price:{" "}
                    {selectedMaterial && selectedMaterial.price !== undefined
                        ? `$${selectedMaterial.price}`
                        : "None"}
                </p>
                <Button onClick={handleAddItemToCart}>Add to Cart</Button>
            </div>
        </div>
    );
}
