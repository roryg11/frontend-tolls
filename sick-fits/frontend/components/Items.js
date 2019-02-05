import React, { Component } from 'react';
import { Query } from "react-apollo";
import gql from "graphql-tag";
import styled from "styled-components";
import Item from "./Item";
import Pagination from "./Pagination";
import { perPage } from "../config";

const Center = styled.div`
    text-align: center; 
`

const ItemsList = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr; 
    grid-gap: 60px;
    max-width: ${props => props.theme.maxWidth};
    margin: 0 auto;
`

const ALL_ITEMS_QUERY = gql`
    query ALL_ITEMS_QUERY($skip: Int =0, $first: Int = ${perPage}) {
        items(first: $first, skip: $skip, orderBy: createdAt_DESC) {
            id
            title
            price
            description
            image
            largeImage
        }
    }
        
`

class Items extends Component {
    render() {
        return (
            <Center>
                <p>Items</p>
                <Pagination page={parseFloat(this.props.page)}/>
                <Query query={ALL_ITEMS_QUERY} 
                    variables={{
                        skip: this.props.page * perPage - perPage,
                        first: perPage
                    }}>
                    {({data, error, loading}) => {
                        if(loading) return <p>LOADING</p>
                        if(error) return <p>ERROR</p>
                        return <ItemsList>
                            {data.items.map((item)=>{
                                return <Item key={item.id} item={item}/>
                            })}
                        </ItemsList>
                    }}
                </Query>
                <Pagination page={parseFloat(this.props.page)}/>
            </Center>
        );
    }
}

export default Items;
export { ALL_ITEMS_QUERY };