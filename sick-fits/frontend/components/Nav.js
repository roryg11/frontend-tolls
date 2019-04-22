import Link from "next/link";
import { Mutation } from "react-apollo";
import NavStyles from "./styles/NavStyles";
import User from "./User";
import Signout from "./Signout";
import CartCount from "./CartCount";
import { TOGGLE_CART_MUTATION } from "../components/Cart";

const Nav = () => (
        <User>
            { ({data: {me}}) => (
                <NavStyles>
                    {me && (
                        <>
                            <Link href="/goals">
                                <a>Goals</a>
                            </Link>
                            <Link href="/addGoals">
                                <a>Add Goal</a>
                            </Link>
                            <Link href="/me">
                                <a>Account</a>
                            </Link>
                            <Signout/>
                            <Mutation mutation={TOGGLE_CART_MUTATION}>
                                { (toggleCart)=>(
                                    <button onClick={toggleCart}>My Cart
                                    <CartCount count={me.cart.reduce((tally, cartItem)=>{
                                        return tally + cartItem.quantity
                                    }, 0)}/>
                                    </button>
                                ) }
                            </Mutation>
                        </>
                    )}

                    {!me && (
                        <Link href="/signup">
                            <a>Signup</a>
                        </Link>
                    )}
                    <Link href="/goals">
                        <a>Home</a>
                    </Link>
                </NavStyles>
                )
            }
        </User>
        
)

export default Nav; 