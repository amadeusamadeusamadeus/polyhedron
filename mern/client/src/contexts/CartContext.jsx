// src/contexts/CartContext.jsx
import { createContext, useReducer } from "react";

const CartContext = createContext({
    items: [],
    totalSum: 0,
    addItem: (item) => {},
    removeItem: (id) => {},
    clearCart: () => {},
});

function cartReducer(state, action) {
    if (action.type === "ADD_ITEM") {
        const existingCartItemIndex = state.items.findIndex(
            (item) => item.uuid === action.item.uuid
        );
        const updatedItems = [...state.items];

        if (existingCartItemIndex > -1) {
            const existingItem = state.items[existingCartItemIndex];
            const updatedItem = {
                ...existingItem,
                quantity: existingItem.quantity + 1,
            };
            updatedItems[existingCartItemIndex] = updatedItem;
        } else {
            updatedItems.push({ ...action.item, quantity: 1 });
        }

        return { ...state, items: updatedItems };
    }

    if (action.type === "REMOVE_ITEM") {
        const existingCartItemIndex = state.items.findIndex(
            (item) => item.uuid === action.id
        );
        const existingCartItem = state.items[existingCartItemIndex];
        const updatedItems = [...state.items];
        if (existingCartItem.quantity === 1) {
            updatedItems.splice(existingCartItemIndex, 1);
        } else {
            const updatedItem = {
                ...existingCartItem,
                quantity: existingCartItem.quantity - 1,
            };
            updatedItems[existingCartItemIndex] = updatedItem;
        }
        return { ...state, items: updatedItems };
    }

    if (action.type === "CLEAR_CART") {
        return { ...state, items: [] };
    }

    return state;
}

export function CartContextProvider({ children }) {
    const [cart, dispatchCartAction] = useReducer(cartReducer, { items: [] });

    function addItem(item) {
        dispatchCartAction({ type: "ADD_ITEM", item });
    }

    function removeItem(id) {
        dispatchCartAction({ type: "REMOVE_ITEM", id });
    }

    function clearCart() {
        dispatchCartAction({ type: "CLEAR_CART" });
    }

    // Compute the total sum from individual item prices and quantities.
    const totalSum = cart.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const cartContext = {
        items: cart.items,
        totalSum,
        addItem,
        removeItem,
        clearCart,
    };

    console.log("CartPage items", cartContext);

    return (
        <CartContext.Provider value={cartContext}>
            {children}
        </CartContext.Provider>
    );
}

export default CartContext;
