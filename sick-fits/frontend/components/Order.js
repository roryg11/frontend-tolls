import React, { Component } from 'react';
import { Query } from "react-apollo";
import gql from "graphql-tag";
import PropTypes from "prop-types";
import Head from "next/head";
import {format} from "date-fns"; 
import formatMoney from "../lib/formatMoney";
import OrderStyles from "./styles/OrderStyles";
import Error from "./ErrorMessage";

const SINGLE_ORDER_QUERY = gql`
    query SINGLE_ORDER_QUERY($id: ID!){
        order(id: $id){
            id
            total
            charge
            createdAt
            user {
                id
            }
            orderItems {
                id
                title
                description
                image
                price
                quantity
            }
        }
    }
`

class Order extends Component {
    static propTypes = {
        id: PropTypes.string.isRequired
    }
    render() {
        return (
            <Query query={SINGLE_ORDER_QUERY} variables={{id: this.props.id}}>
                {({data, loading, error})=>{
                    if(error) return <Error error={error}/>;
                    if(loading) return <p>Loading...</p>;
                    const { order } = data; 
                    return(
                        <OrderStyles>
                            <Head>
                                <title>Sick Fits | Order Id {order.id}</title>
                            </Head>
                            <p>
                                <span>Order ID</span>
                                <span>{order.id}</span>
                            </p>
                            <p>
                                <span>Charge</span>
                                <span>{order.charge}</span>
                            </p>
                            <p>
                                <span>Date</span>
                                <span>{format(order.createdAt, "MMMM d, YYYY h:mm a")}</span>
                            </p>
                            <p>
                                <span>Order Total</span>
                                <span>{formatMoney(order.total)}</span>
                            </p>
                            <p>
                                <span>Order Count</span>
                                <span>{order.orderItems.length}</span>
                            </p>
                            <div className="items">
                                {order.orderItems.map(item=>(
                                    <div className="order-item" key={item.id}>
                                        <img src={item.image} alt={item.title}/>
                                        <div className="item-details">
                                            <h2>{item.title}</h2>
                                            <p>Each: {formatMoney(item.price)}</p>
                                            <p>Subtotal: {formatMoney(item.quantity * item.price)}</p>
                                            <p>{item.description}</p>
                                        </div>
                                    </div>    
                                ))}
                            </div>
                        </OrderStyles>
                    )
                }}
            </Query>

        );
    }
}

export default Order;
export { SINGLE_ORDER_QUERY };