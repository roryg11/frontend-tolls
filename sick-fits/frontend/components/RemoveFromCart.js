import React, { Component } from 'react';
import PropTypes from "prop-types";
import styled from "styled-components";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import { CURRENT_USER_QUERY } from "./User";

const REMOVE_FROM_CART_MUTATION = gql`
    mutation REMOVE_FROM_CART_MUTATION($id: ID!){
        removeFromCart(id: $id){
            id
        }
    }
`

const BigButton = styled.button`
    font-size: 3rem;
    background: none;
    border: 0;
    &:hover {
        color: ${ props => props.theme.red};
        cursor: pointer;
    }
`;

class RemoveFromCart extends Component {
    static propTypes = {
        id: PropTypes.string.isRequired
    } 

    update = (cache, payload) => {
        const data = cache.readQuery({query: CURRENT_USER_QUERY});

        // this is basically the specified payload from your mutation
        const cartItemId = payload.data.removeFromCart.id

        data.me.cart = data.me.cart.filter(cartItem => cartItem.id !== cartItemId);

        cache.writeQuery({query: CURRENT_USER_QUERY, data});
    }

    render() {
        return (
            // prisma automatically injects typenames, but since we're doing this
            // on the client, we need to add them ourselves
            <Mutation mutation={REMOVE_FROM_CART_MUTATION} 
                    update={this.update}
                    optimisticResponse={{
                        __typename: 'Mutation',
                        removeFromCart: {
                            __typename: 'CartItem',
                            id: this.props.id
                        }
                    }}>
                { (removeFromCart, {loading, error}) => (
                    <BigButton
                        disabled={loading}
                        onClick={()=>{
                            // you can also pass the variables into this function if 
                            // you prefer (I personally like how that looks)
                            return removeFromCart({variables: { id: this.props.id}}).catch( err => console.log(err.message));
                        } }
                        title="Delete Item" > &times;</BigButton>
                ) }
            </Mutation>
        );
    }
}

export default RemoveFromCart;
export {REMOVE_FROM_CART_MUTATION}; 