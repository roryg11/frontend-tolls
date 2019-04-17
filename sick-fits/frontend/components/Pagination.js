    import React, { Component } from 'react';
    import Link from "next/link";
    import Head from "next/head";
    import PaginationStyles from "./styles/PaginationStyles";
    import { Query } from "react-apollo";
    import gql from "graphql-tag";
    import { perPage } from "../config.js" 
    import Error from "./ErrorMessage";



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
                            if(error) return <Error error={error}/>
                            if(loading) return <p>Loading...</p>; 
                            const count = data.itemsConnection.aggregate.count;
                            const pages = Math.ceil(count/perPage);
                            const {page} = this.props;
                            return (<PaginationStyles data-test="pagination">
                                <Head>
                                    <title>Sick Fits | {page} of {pages}</title>
                                </Head>
                                <Link prefetch
                                href={{
                                        pathName: "/items",
                                        query: {
                                            page: page -1
                                        }
                                    }}><a className="prev" aria-disabled={page <= 1}>Prev</a></Link>
                                <p>{page} of <span className="totalPages">{pages}</span></p>
                                <Link prefetch
                                href={{
                                        pathName: "/items",
                                        query: {
                                            page: page + 1
                                        }
                                    }}><a className="next" aria-disabled={page >= pages}>Next</a></Link>
                            </PaginationStyles>);

                        } }
                    </Query>
            );
        }
    }
    
    export default Pagination;
    export {PAGINATION_QUERY};