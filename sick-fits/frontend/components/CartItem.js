import styled from "styled-components";
import formatMoney from "../lib/formatMoney";
import RemoveFromCart from "./RemoveFromCart";

const CartStyles = styled.li`
    padding: 1rem 0;
    display: grid;
    grid-template-columns: auto 1fr auto;
    border-bottom: 1px solid ${ props => props.theme.lightGrey};
    align-items: center;
    img {
        margin-right: 10px;
    }
    h3, p {
        margin: 0; 
    }
`

const CartItem = props => {
    const {cartItem} = props;
    if(!cartItem.item){ 
        return (
            <CartStyles>
                <div>&nbsp;</div>
                <p>This item has been removed</p>
                <RemoveFromCart id={cartItem.id}/>
            </CartStyles>
        )
    };
    return (
        <CartStyles>
            <img width="100" src={cartItem.item.image}/>
            <div className="cart-item-details">
                <h3>{cartItem.item.title}</h3>
                <p>
                    {formatMoney(cartItem.item.price * cartItem.quantity)}
                    {' - '}
                    <em>
                        {cartItem.quantity} &times; {formatMoney(cartItem.item.price)} each
                    </em>
                </p>
            </div>
            <RemoveFromCart id={cartItem.id}/>
        </CartStyles>
    )
}

export default CartItem; 