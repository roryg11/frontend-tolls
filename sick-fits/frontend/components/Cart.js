import {Query, Mutation} from "react-apollo";
import gql from "graphql-tag";
import User from "./User";
import CartStyles from "./styles/CartStyles"
import CloseButton from "./styles/CloseButton"
import SickButton from "./styles/SickButton"
import Supreme from "./styles/Supreme"
import CartItem from "./CartItem";
import calcTotalPrice from "../lib/calcTotalPrice";
import formatMoney from "../lib/formatMoney";

const LOCAL_STATE_QUERY = gql`
    query {
        cartOpen @client
    }
`

const TOGGLE_CART_MUTATION = gql`
    mutation {
        toggleCart @client
    }
`

const Cart = props => (
    <User>
        { ( { data:{me} })=>{
            if(!me){
                return null;
            }
            return(
                <Mutation mutation={TOGGLE_CART_MUTATION}>
                    { (toggleCart)=>(
                        <Query query={LOCAL_STATE_QUERY}>
                            { ({data}) => (
                                <CartStyles open={data.cartOpen}>
                                    <header>
                                        <CloseButton title="close" onClick={toggleCart}>&times;</CloseButton>
                                        <Supreme>Your Cart</Supreme>
                                        <p>You have {me.cart.length} item{me.cart.length > 1 ? "s": ""} in your cart</p>
                                    </header>
                                    <ul>
                                        { me.cart.map((cartItem)=>(
                                            <CartItem cartItem={cartItem} key={cartItem.id}/>
                                        ))}
                                    </ul>
                                    <footer>
                                        <p>{formatMoney(calcTotalPrice(me.cart))}</p>
                                        <SickButton>Checkout</SickButton>
                                    </footer>
                                </CartStyles>
                            )}
                        </Query>
                    )}
                </Mutation>
            )
        }}
    </User>
    
)

export default Cart; 
export { LOCAL_STATE_QUERY };
export { TOGGLE_CART_MUTATION }; 