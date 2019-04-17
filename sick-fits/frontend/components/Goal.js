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
import AddButton from "./styles/AddButton";

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
    .goal{
        transition: all 400ms ease-in;
        opacity: 0;
        position: absolute;
        z-index: 2; 
        height: 400px;
    }
    .goal-enter {
        opacity: 0;
        transition: all 4s ease-in;
    }

    .goal-enter-active {
        opacity: 1;
        transition: all 4s ease-in;
    }

    .goal-exit {
        opacity: 0;
        transition: all 4s ease-in;
    }

    .goal-exit-active {
        opacity: 0;
        transition: all 4s ease-in;  
    }
`

const OuterGoalContainer = styled.div`
    overflow: hidden;
    height: 400px;
    position: relative;
`
const FadeOut = styled.div`  
    .view{
        transition: all 400ms ease-in;
        opacity: 0;
        position: fixed;
        height: 400px;
    }
    .view-enter {
        opacity: 0;
        transition: all 4s ease-in;
    }

    .view-enter-active {
        opacity: 1;
        transition: all 4s ease-in;
    }

    .view-exit {
        opacity: 1;
        transition: all 4s ease-in;
    }

    .view-exit-active {
        opacity: 0;
        transition: all 4s ease-in;  
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
        showView: true,
        showEdit: false
    }
    switchView = () => {
        const newVal = !this.state.showEdit; 
        this.setState({showEdit: newVal});
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
                                                <button onClick={this.switchView}>Edit</button>
                                                <button onClick={(e)=> this.deleteGoal(e, deleteGoal)}>Delete</button>
                                            </Flex>
                                            <OuterGoalContainer>
                                                <FadeOut>
                                                    <CSSTransition
                                                            unmountOnExit
                                                            in={!this.state.showEdit}
                                                            classNames="view"
                                                            className="view"
                                                            key={`view-${goal.id}`}
                                                            timeout={{enter: 400, exit:100}}>
                                                            <GoalDetail className="view" goal={goal}/>
                                                    </CSSTransition>
                                                </FadeOut>
                                                <FadeIn>
                                                    <CSSTransition
                                                            unmountOnExit
                                                            in={!!this.state.showEdit}
                                                            classNames="goal"
                                                            className="goal"
                                                            key={`edit-${goal.id}`}
                                                            timeout={{enter: 400, exit: 0}}>
                                                            <UpdateGoal className="goal" goal={goal}/>
                                                    </CSSTransition>
                                                </FadeIn>
                                            </OuterGoalContainer>
                                            <div>
                                                <Flex>
                                                    <GoalHeadline>Milestones</GoalHeadline>
                                                    <Link href={ {
                                                        pathname: `/addMilestone`,
                                                        query: { id: goal.id },
                                                        }}>
                                                        <a>
                                                            <AddButton>+</AddButton>
                                                        </a>
                                                    </Link>
                                                </Flex>
                                                <div>
                                                    { goal.tasks.map((task)=>{
                                                        return( 
                                                        <div>
                                                            <Link
                                                                href= {{
                                                                    pathname: '/milestone',
                                                                    query: { id: task.id }
                                                                }}
                                                            ><a>{task.name}</a>
                                                            </Link>
                                                        </div>)
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