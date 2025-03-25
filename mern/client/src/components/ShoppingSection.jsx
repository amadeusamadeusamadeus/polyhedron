// src/components/ShoppingSection.jsx
import React, {useContext} from "react";
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
                                            selectedShape,
                                            shapes,
                                            onShapeChange
                                        }) {
    const cartContext = useContext(CartContext);
    const userProgressCtx = useContext(UserProgressContext);

    const formatMaterialName = (name) => {
        return name.split("_polished")[0];
    };

    const totalCartItems = cartContext.items.reduce(
        (total, item) => total + item.quantity,
        0
    );

    function handleShowCart() {
        userProgressCtx.showCart();
    }

    function handleAddItemToCart() {
        if (selectedMaterial && selectedShape) {
            const newItem = {
                ...selectedMaterial,
                shapeName: selectedShape.name,
            };
            cartContext.addItem(newItem);
        } else {
            console.log("No material or shape selected to add to cart.");
        }
    }

    return (
        <div className="menu-div">
            <div className="model-menus">
                <div className="variation-menu">
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
                <div className="shape-menu-section">
                    <ShapeMenu shapes={shapes} onShapeChange={onShapeChange}/>
                </div>
            </div>
            <div className="purchase-menu text-wrap">
                <div className="selected-material text-wrap">
                    <p>
                        Currently selected material:{" "}
                        {selectedMaterial ? formatMaterialName(selectedMaterial.name) : "None"}
                    </p>
                </div>
                <div>
                    <p>
                        Price:{" "}
                        {selectedMaterial && selectedMaterial.price !== null
                            ? `€${selectedMaterial.price.toFixed(2)}`
                            : "Not available"}
                    </p>
                </div>
            </div>
            <div>
                <Button disableActive={true} onClick={handleAddItemToCart}>Add to Cart</Button>
                <Button disableActive={true} onClick={handleShowCart}>
                    Cart ({totalCartItems})
                </Button>

            </div>
        </div>
    );
}
