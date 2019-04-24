import React, { Component } from 'react';
import { CSSTransition, TransitionGroup} from "react-transition-group";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import styled from "styled-components";
import {GOAL_TASK_QUERY} from "./Task";
import { FlexCenterAlign } from "./styles/FlexUtilities";

const UPDATE_SUBTASK_MUTATION = gql`
    mutation UPDATE_SUBTASK_MUTATION(
        $id: ID!
        $complete: Boolean
    ) {
        updatesubtask(
            id: $id
            complete: $complete
        ) {
            subTask {
                id
                name
                description
                complete
            }
        }
    }
`

const DELETE_SUBTASK_MUTATION = gql`
    mutation DELETE_SUBTASK_MUTATION(
        $id: ID!
    ) {
        deleteSubTask(id: $id){
            id
        }
    }
`

const Subtask = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px ${props=> props.theme.lightgrey} solid;
`

// make font atoms with this kind of thing
const DescriptionText = styled.div`
    font-family: Lato;
    font-style: italic;
    font-size: 15px;
    color: black; 
    padding-left: 10px;
`

const IconButton = styled.span`
    border-box: box-sizing;
    background-color: transparent;
    color: ${props => props.theme.lightgrey};
    border: 1px solid transparent;
    border-radius: 50%;
    padding: 0.5rem;
    line-height: 2rem;
    width: 3rem;
    margin-left: 1rem;
    font-weight: 100;
    font-feature-settings: tnum;
    font-variant-numeric: tabular-nums;
    text-align: center;
    &:hover{
        border: 1px solid ${props=> props.theme.lightgrey};
        color: black;
    }
`

class SingleSubtask extends Component {
    changeStatus = (e, updateTaskMutation) => {
        const {checked, id} = e.target;
        updateTaskMutation({
            variables: {
                id,
                complete: checked
            }
        });
    }
    render() {
        const {subtask} = this.props; 
        return (
                <Subtask>
                    <div>
                        <div>{subtask.name}</div>
                        <DescriptionText>{subtask.description}</DescriptionText>
                    </div>
                    <FlexCenterAlign>
                        <Mutation mutation={UPDATE_SUBTASK_MUTATION} variables={{id: subtask.id, complete: subtask.complete}}>
                            { (updateTask, {loading, error})=> {
                                    return (
                                        <input name="complete" type="checkbox" checked={subtask.complete} onChange={(e)=>this.updateStatus(e, updatesubtask)} id={subtask.id}/>
                                    )
                                }
                            }
                        </Mutation>
                        <Mutation mutation={DELETE_SUBTASK_MUTATION} variables={{id: subtask.id}} refetchQueries={[{query: GOAL_TASK_QUERY, variables: {id: this.props.taskId}}]}>
                            { 
                                (deleteSubTask, {loading, error})=>{
                                    return (
                                        <IconButton onClick={deleteSubTask}>x</IconButton>
                                    )
                                }
                            }
                        </Mutation>
                    </FlexCenterAlign>
                </Subtask>
        );
    }
}

export default SingleSubtask;