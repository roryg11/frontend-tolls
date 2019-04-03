import React, { Component } from 'react';
import { Query, Mutation } from "react-apollo";
import Link from "next/link";
import gql from "graphql-tag";
import styled from "styled-components";
import { TransitionGroup, CSSTransition} from "react-transition-group";
import Error from "./ErrorMessage";
import Title from "./styles/Title";
import { MEASUREMENTS } from "./CreateGoal";
import UpdateGoal from "./UpdateGoal";
import GoalDetail from "./GoalDetail";

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

const DELETE_GOAL_MUTATAION = gql`
    mutation DELETE_GOAL_MUTATION($id: ID!){
        deleteGoal(id: $id){
            id
        }
    }
`

const FadeIn = styled.div`
    position: relative;
    .goal{
        display: block;
        position: relative;
        transition: all 4s;
        height: 100%;
    }
    .goal-enter {
        height: 0%;
    }

    .goal-enter-active {
        height: 300px;
        transition: height 500ms ease-in;
    }

    .goal-exit {
        height: 300px;
    }

    .goal-exit-active {
        height: 0px;
        transition: height 300ms ease-in;
    }
`

// put the delete goal here or in the update goal? 

const GoalHeadline = styled.h2`
    border-bottom: 3px solid ${props=> props.theme.accentColor};
    text-align: center;
    flex-grow: 1; 
    display: flex;
`

const Flex = styled.div`
    display: flex;
    align-items: center;
`

class Goal extends Component {
    state = {
        showEdit: false
    }
    switchGoalView= ()=>{
        const newVal = !this.state.showEdit;
        this.setState({showEdit: newVal }); 
    }

    deleteGoal = (e, deleteGoalMutation) => {
        if(confirm("Are you sure? Deleting this goal will delete all of your associated tasks and subtasks")){
            return deleteGoalMutation({
                variables: {
                    id: this.props.id
                }
        }) }
    } 

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
                            <Mutation mutation={DELETE_GOAL_MUTATAION} variables={ {id: goal.id}}>
                                {(deleteGoal, {loading, error})=>{
                                    return(
                                        <div>
                                            <Flex>
                                                <GoalHeadline>{goal.name}</GoalHeadline>
                                                <button onClick={this.switchGoalView}>Edit</button>
                                                <button onClick={(e)=> this.deleteGoal(e, deleteGoal)}>Delete</button>
                                            </Flex>
                                            <div>
                                                <FadeIn>
                                                    <TransitionGroup>
                                                        <CSSTransition
                                                            unmountOnExit
                                                            classNames="goal"
                                                            key={`read-${goal.id}`}
                                                            timeout={{enter: 4000, exit:4000}}>
                                                            <GoalDetail goal={goal}/>
                                                        </CSSTransition>
                                                    </TransitionGroup>
                                                </FadeIn>
                                                <FadeIn>
                                                    <TransitionGroup>
                                                        <CSSTransition
                                                            unmountOnExit
                                                            classNames="goal"
                                                            key={`read-${goal.id}`}
                                                            timeout={{enter: 4000, exit:4000}}>
                                                            <UpdateGoal goal={goal}/>
                                                        </CSSTransition>
                                                    </TransitionGroup>
                                                </FadeIn>
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
                                }}
                            </Mutation>
                        )
                    }
                }
            </Query>
        )
    }
}

export default Goal;