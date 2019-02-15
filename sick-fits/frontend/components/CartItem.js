import styled from "styled-components";
import formatMoney from "../lib/formatMoney";

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
    return (
        <CartStyles>
            <img width="100" src={cartItem.item.image}/>
            <div className="cart-item-details">
                <h3>{cartItem.item.title}</h3>
                <p>
                    {formatMoney(cartItem.item.price)}
                    {' - '}
                    <em>
                        {cartItem.quantity} &times; {formatMoney(cartItem.item.price)} each
                    </em>
                </p>
            </div>

        </CartStyles>
    )
}

export default CartItem; 