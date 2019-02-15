    import React, { Component } from 'react';
    import PaginationStyles from "./styles/PaginationStyles";
    import { Query } from "react-apollo";
    import gql from "graphql-tag";
    import { perPage } from "../config.js" 
    import Link from "next/link";
    import Head from "next/head";

    const PAGINATION_QUERY = gql`
        query PAGINATION_QUERY {
            itemsConnection {
                aggregate {
                    count
                }
            }
        }
    `
    
    class Pagination extends Component {
        render() {
            return (
                    <Query query={ PAGINATION_QUERY }>
                        { ({data, loading, error})=>{
                            if(loading) return <p>Loading...</p>; 
                            const count = data.itemsConnection.aggregate.count;
                            const pages = Math.ceil(count/perPage);
                            return (<PaginationStyles>
                                <Head>
                                    <title>Sick Fits | {this.props.page} of {pages}</title>
                                </Head>
                                <Link prefetch
                                href={{
                                        pathName: "/items",
                                        query: {
                                            page: this.props.page -1
                                        }
                                    }}><a>Prev</a></Link>
                                <p>{this.props.page} of {pages}</p>
                                <Link prefetch
                                href={{
                                        pathName: "/items",
                                        query: {
                                            page: this.props.page + 1
                                        }
                                    }}><a>Next</a></Link>
                            </PaginationStyles>);

                        } }
                    </Query>
            );
        }
    }
    
    export default Pagination;