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
import {FormSlideLeft} from "./styles/Form";
import {Flex, FlexCenterAlign} from "./styles/FlexUtilities";
import SickButton from "./styles/SickButton";
import {SecondaryButton, PrimaryButton} from "./styles/Buttons";
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

const OuterGoalContainer = styled.div`
    overflow: hidden;
    height: 400px;
    position: relative;
`


const GoalHeadline = styled.div`
    border-bottom: 3px solid ${props=> props.theme.accentColor};
    text-align: center;
    flex-grow: 1; 
    display: flex;
    justify-content: space-between;
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

    updateCallback = () => {
        this.switchView();
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
                                                <GoalHeadline>
                                                    <h3>{goal.name}</h3>
                                                    <div>
                                                        <PrimaryButton theme={this.props.theme}onClick={this.switchView}>Edit</PrimaryButton>
                                                        <SecondaryButton  theme={this.props.theme} onClick={(e)=> this.deleteGoal(e, deleteGoal)}>Delete</SecondaryButton>  
                                                    </div>
                                                </GoalHeadline>
                                            </Flex>
                                            <Flex style={{overflow: "hidden"}}>
                                                { !this.state.showEdit && (<GoalDetail className="view" goal={goal}/>)} 
                                                <FormSlideLeft showing={this.state.showEdit}>
                                                    <UpdateGoal className="goal" goal={goal} updateCb={this.updateCallback}/>
                                                </FormSlideLeft> 
                                            </Flex>                
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
                                                        <div key={task.id}>
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