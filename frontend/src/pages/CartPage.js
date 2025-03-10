import CartPageComponent from "../components/PagesComponents/CartPageComponent.js"

import { useSelector, useDispatch } from "react-redux";
import { addToCart, removeFromCart, editQuantity } from "../redux/actions/cartActions";

const CartPage = () => {

    const cartItems = useSelector((state) => state.cart.cartItems);
    const cartSubtotal = useSelector((state) => state.cart.cartSubtotal);
    const reduxDispatch = useDispatch();

    return <CartPageComponent addToCart={addToCart} removeFromCart={removeFromCart} editQuantity={editQuantity} cartItems={cartItems} cartSubtotal={cartSubtotal} reduxDispatch={reduxDispatch} />;

};

export default CartPage;

