import React, { Component } from 'react';
import { CSSTransition, TransitionGroup} from "react-transition-group";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import styled from "styled-components";
import {FormattedDate} from "react-intl";
import {GOAL_TASK_QUERY} from "./Task";
import { FlexCenterAlign, Flex } from "./styles/FlexUtilities";
import {SecondaryText} from "./styles/Text";

const UPDATE_SUBTASK_MUTATION = gql`
    mutation UPDATE_SUBTASK_MUTATION(
        $id: ID!
        $complete: Boolean,
        $completedAt: DateTime
    ) {
        updateSubTask(
            id: $id
            complete: $complete,
            completedAt: $completedAt
        ) {
            id
            name
            description
            complete
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
                complete: checked,
                completedAt: new Date()
            }
        });
    }
    render() {
        const {subtask} = this.props; 
        return (
                <Subtask>
                    <div>
                        <Flex>
                            {subtask.name} 
                            { subtask.dueDate && (
                                <SecondaryText>
                                    <FormattedDate value={subtask.dueDate}/>
                                </SecondaryText>
                            )}
                            
                        </Flex>
                        <SecondaryText>{subtask.description}</SecondaryText>
                    </div>
                    <FlexCenterAlign>
                        <Mutation mutation={UPDATE_SUBTASK_MUTATION} variables={{id: subtask.id, complete: subtask.complete}} refetchQueries={[{query: GOAL_TASK_QUERY, variables: {id: this.props.taskId}}]}>
                            { (updateSubTask, {loading, error})=> {
                                    return (
                                        <input name="complete" type="checkbox" checked={subtask.complete} onChange={(e)=>this.changeStatus(e, updateSubTask)} id={subtask.id}/>
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