import React from "react";
import Downshift from "downshift";
import Router from "next/router";
import { ApolloConsumer } from "react-apollo";
import gql from "graphql-tag";
import debounce from "lodash.debounce";
import { DropDown, DropDownItem, SearchStyles } from "./styles/DropDown";

const SEARCH_ITEMS_QUERY = gql`
    query SEARCH_ITEMS_QUERY($searchTerm: String!) {
        items(where: {
            OR: [
                {title_contains: $searchTerm},
                {description_contains: $searchTerm}
            ]
        }) {
            id
            image
            title
        }
    }
`

function routeToItem (item) {
    Router.push({
        pathname: "/item",
        query: {
            id: item.id
        }
    })
}

class AutoComplete extends React.Component {
    state = {
        items: [],
        loading: false
    };

    onChange = debounce(async (e, client) => {
        this.setState({loading: true});
        const res = await client.query({
            query: SEARCH_ITEMS_QUERY,
            variables: { searchTerm: e.target.value }
        }); 

        this.setState({
            items: res.data.items,
            loading: false
        });
    }, 350);
    render (){
        return(
            <SearchStyles>
                <Downshift itemToString={ item => item === null? "" : item.title} onChange={routeToItem}>
                    { ({getInputProps, getItemProps, isOpen, inputValue, highlightedIndex}) => {
                        return ( 
                            <div>
                            <ApolloConsumer>
                                { (client)=> {
                                    return (
                                        <input 
                                            {...getInputProps({
                                                type: "search",
                                                id: "search",
                                                className: this.state.loading ? "loading" : "",
                                                onChange:  (e) => {
                                                    e.persist();
                                                    this.onChange(e, client);
                                                }
                                            })}
                                            />
                                    )}}
                                    </ApolloConsumer>
                                    { isOpen && (
                                        <DropDown>
                                        { 
                                            this.state.items.map((item, index)=>{
                                                return (
                                                    <DropDownItem key={item.id} {...getItemProps({item})} highlighted={index === highlightedIndex}>
                                                        <img width="50" src={item.image} alt={item.title}/>
                                                        <p>{item.title}</p>
                                                    </DropDownItem>
                                                );
                                            })
                                        }
                                        {!this.state.items.length && !this.state.loading && (
                                            <DropDownItem>
                                                Nothing found for {inputValue}
                                            </DropDownItem>
                                        )}
                                    </DropDown>
                                    )}
                            </div>);
                    }}
                </Downshift>

            </SearchStyles>
        )
    }
}

export default AutoComplete;