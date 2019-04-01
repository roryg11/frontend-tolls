import React, { Component } from 'react';
import { Query } from "react-apollo";
import Link from "next/link";
import gql from "graphql-tag";
import styled from "styled-components";
import Error from "./ErrorMessage";
import Title from "./styles/Title";
import { MEASUREMENTS } from "./CreateGoal";

const SINGLE_GOAL_QUERY = gql`
    query SINGLE_GOAL_QUERY($id: ID!){
        goal(id: $id) {
            id
            name
            description
            measurement
            dueDate
            tasks {
                id
                name
                description
            }
        }
    }
`

const GoalHeadline = styled.h2`
    border-bottom: 3px solid ${props=> props.theme.accentColor};
    text-align: center;
    flex-grow: 1; 
    display: flex;
`

const GoalDescription = styled.span`
    font-weight: 100;
`

const Flex = styled.div`
    display: flex;
    align-items: center;
`

class Goal extends Component {
    render(){
        const {id} = this.props; 
        // export any styles here to goal styles
        return (
            <Query query={SINGLE_GOAL_QUERY} variables={ {id} }>
                { ({data, error, loading}) => {
                        if(error) return <Error error={error}/>;
                        if(loading) return <p>Loading...</p>;
                        const { goal } = data; 
                        return (
                            <div>
                            
                                <GoalHeadline>{goal.name}</GoalHeadline>
                                <div>
                                    <div> <h4>WHY?</h4> <GoalDescription>{goal.description}</GoalDescription></div>
                                    <div> <h4>Due Date:</h4> {goal.dueDate} NEED A CALENDAR WIDGET HERE</div>
                                    <div>How will I measure my success?
                                        { (goal.measurement ===  MEASUREMENTS.frequency) && <span>By building habits</span>}
                                        { (goal.measurement ===  MEASUREMENTS.list) && <span>By working through a to-do list</span>}
                                    </div>
                                    <p>What success looks like: NEED TO ADD THIS TO GOAL CREATION</p>
                                </div>
                                <div>
                                    <Flex>
                                        <GoalHeadline>Milestones</GoalHeadline>
                                        <Link href={ {
                                            pathname: `/addMilestone`,
                                            query: { id: goal.id },
                                            }}>
                                            <a>Add</a>
                                        </Link>
                                    </Flex>
                                    <div>
                                        { goal.tasks.map((task)=>{
                                            return <p>{task.name}</p>;
                                        })
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                    }
                }
            </Query>
        )
    }
}

export default Goal;