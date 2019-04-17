import React, { Component } from 'react';
import { Query } from "react-apollo";
import gql from "graphql-tag";
import styled from "styled-components";
import Link from "next/link";
import {formatDistance} from "date-fns";
import formatMoney from "../lib/formatMoney";
import Error from "./ErrorMessage";
import OrderItemStyles from "./styles/OrderItemStyles";

const OrderUl=styled.ul`
    display: grid;
    grid-gap: 4rem;
    grid-template-columns: repeat(auto-fit, minmax(40%, 1fr));
`

const USER_ORDERS_QUERY = gql`
    query USER_ORDERS_QUERY{
        orders {
            id
            total
            createdAt
            charge
            user {
                id
            }
            orderItems {
                id
                title
                image
                description
                price
                quantity
            }

        }
    }
`

class OrdersList extends Component {
    render() {
        return (
            <Query query={USER_ORDERS_QUERY}>
                {({data, loading, error})=>{
                    const {orders} = data; 
                    if(error) <Error error={error}/>
                    if(loading) <p>Loading...</p>
                    return (
                        <div>
                            <h2>You have {orders.length} Orders</h2>
                            <OrderUl>
                                { orders.map((order)=>(
                                    <OrderItemStyles key={order.id}>
                                        <Link href={{
                                            pathname: '/orderPage',
                                            query: {id: order.id}
                                        }}>
                                            <a>
                                                <div className="order-meta">
                                                    <p>{ order.orderItems.reduce((a,b)=>a + b.quantity, 0)} Items</p>
                                                    <p>{order.orderItems.length} Products</p>
                                                    <p>{formatDistance(order.createdAt, new Date())}</p>
                                                    <p>{formatMoney(order.total)}</p>
                                                </div>
                                                <div className="images">
                                                    {order.orderItems.map(item=>(
                                                        <img key={item.id} src={item.image} alt={item.title}/>
                                                    ))}
                                                </div>
                                            </a>
                                        </Link>
                                    </OrderItemStyles>
                                ))}
                                
                            </OrderUl>
                        </div>
                    )
                }}
            </Query>
        );
    }
}

export default OrdersList;