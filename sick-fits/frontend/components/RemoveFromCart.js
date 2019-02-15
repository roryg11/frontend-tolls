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

    render() {
        return (
            <Mutation mutation={REMOVE_FROM_CART_MUTATION} refetchQueries={ [{query: CURRENT_USER_QUERY}] }>
                { (removeFromCart, {loading, error}) => (
                    <BigButton
                        disabled={loading}
                        onClick={()=>{
                            // you can also pass the variables into this function if 
                            // you prefer (I personally like how that looks)
                            return removeFromCart({variables: { id: this.props.id}}).catch( err => alert(err.message));
                        } }
                        title="Delete Item" > &times;</BigButton>
                ) }
            </Mutation>
        );
    }
}

export default RemoveFromCart;