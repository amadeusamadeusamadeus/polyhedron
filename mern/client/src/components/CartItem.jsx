//TODO: ADD PRICE in constructor+ after quantity


export default function CartItem({ name, quantity, onIncrease, onDecrease}) {

    return <li className="cart-item">

        <p>
            {name} - {quantity}
        </p>
        <p className="cart-item-actions">
            <button onClick={onDecrease}>-</button>
            <span>{quantity}</span>
            <button onClick={onIncrease}>+</button>
        </p>
    </li>
}