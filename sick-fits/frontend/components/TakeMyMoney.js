import React, { Component } from 'react';
import StripeCheckout from "react-stripe-checkout";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Router from "next/router";
import NProgress from "nprogress";
import PropTypes from "prop-types";
import calcTotalPrice from "../lib/calcTotalPrice";
import User, { CURRENT_USER_QUERY } from "./User";
import Error from "./ErrorMessage";

const CREATE_ORDER_MUTATION = gql`
    mutation CREATE_ORDER_MUTATION($token: String!){
        createOrder(token: $token){
            id
            charge
            total
            orderItems {
                id
                title
            }
        }
    }
`


class TakeMyMoney extends Component {

    onToken = async (res, createOrder) => {
        NProgress.start();
        const order = await createOrder({variables: {token: res.id}}).catch(err => alert(err.message));
        Router.push({
            pathname: "/orderPage",
            query: {
                id: order.data.createOrder.id
            }
        });
    }

    render() {
        return (
            <User>
                { ({data: {me}, loading})=> {
                    if(loading) return null;
                    return(
                        <Mutation mutation={CREATE_ORDER_MUTATION} refetchQueries={[{query: CURRENT_USER_QUERY}]}>
                            { (createOrder) => (
                                <StripeCheckout 
                                    stripeKey="pk_test_jWLnuvcwjua9RSFH8PACLAe7"
                                    name={me.name}
                                    email={me.email}
                                    image={me.cart[0].item ? me.cart[0].item.image : null}
                                    amount={calcTotalPrice(me.cart)}
                                    currency="USD"
                                    token={(res)=>{
                                        return this.onToken(res, createOrder);
                                    }}>
                                    {this.props.children}
                                </StripeCheckout>
                                )
                            }
                        </Mutation>
                    )
                }}
                 
            </User>
        );
    }
}

export default TakeMyMoney;
export { CREATE_ORDER_MUTATION };