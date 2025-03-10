// src/components/ShoppingSection.jsx
import React, { useContext } from "react";
import MaterialMenu from "./MaterialMenu";
import ShapeMenu from "./ShapeMenu"; // New import for the ShapeMenu component
import Button from "./UI/Button.jsx";
import CartContext from "../store/CartContext.jsx";
import UserProgressContext from "../store/UserProgressContext.jsx";
import Navbar from "react-bootstrap/Navbar";

export default function ShoppingSection({
                                            variations,
                                            config,
                                            onSelectVariation,
                                            selectedMaterial,
                                            selectedShape,  // currently selected shape
                                            shapes,         // new prop: list of shapes for the shape menu
                                            onShapeChange   // new prop: shape change handler
                                        }) {
    const cartContext = useContext(CartContext);
    const userProgressCtx = useContext(UserProgressContext);

    // Calculate total items in cart.
    const totalCartItems = cartContext.items.reduce(
        (total, item) => total + item.quantity,
        0
    );

    function handleShowCart() {
        userProgressCtx.showCart();
    }

    function handleAddItemToCart() {
        if (selectedMaterial && selectedShape) {
            // Create a new cart item that includes the shape name.
            const newItem = {
                ...selectedMaterial,
                shapeName: selectedShape.name,  // e.g. "D20"
            };
            cartContext.addItem(newItem);
        } else {
            console.log("No material or shape selected to add to cart.");
        }
    }

    return (
        <div>
            {/* Integrated ShapeMenu */}
            <div className="shape-menu-section p-3">
                <ShapeMenu shapes={shapes} onShapeChange={onShapeChange} />
            </div>

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
                <Button onClick={handleAddItemToCart}>Add to Cart</Button>
                <Button textOnly onClick={handleShowCart}>
                    Cart ({totalCartItems})
                </Button>
            </div>
        </div>
    );
}
