import React, { Component } from 'react';
import Link from "next/link";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import styled from "styled-components";
import Error from "./ErrorMessage";

const USER_GOALS_QUERY = gql`
    query USER_GOALS_QUERY {
        goals {
            id
            name
            description
        }
    }
`

const GoalUl=styled.ul`
    display: grid;
    grid-gap: 4rem;
    grid-template-columns: repeat(auto-fit, minmax(40%, 1fr));
`

const GoalsLI = styled.li`
    list-style: none;
    box-shadow: ${props=> props.theme.bs};
    padding: 10px;
    max-width: 400px;
`

class GoalsList extends Component {
    render(){
        return(
            <Query query={USER_GOALS_QUERY}>
                { ({data, loading, error}) => {
                    const {goals} = data; 
                    if(error) return <Error error={error}/>;
                    if(loading) return <p>Loading...</p>;
                    return (
                        <GoalUl>
                            { goals.map((goal)=>{
                                return (
                                <GoalsLI key={goal.id}>
                                    <Link href={ {
                                        pathname: "/goal",
                                        query: { id: goal.id },
                                        }}>
                                        <a>{goal.name}</a>
                                    </Link>
                                    <p>the WHY?</p>
                                    <p>{goal.description}</p>
                                    <p>ADD METRICS FOR HOW FAR ALONG YOU ARE</p>
                                </GoalsLI>)
                            })}
                        </GoalUl>);
                    }
                }
            </Query>
        );
    }
}

export default GoalsList;