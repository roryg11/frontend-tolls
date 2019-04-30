import React, { Component } from 'react';
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import styled from "styled-components";
import Router from "next/router";
import { CSSTransition} from "react-transition-group";
import {FormattedDate} from "react-intl";
import Error from "./ErrorMessage";
import UpdateTask from "./UpdateTask";
import SickButton from "./styles/SickButton";
import {FlexCenterAlign, FlexCenterBetween, Flex} from "./styles/FlexUtilities";
import FormDialog from "./FormDialog";
import SubtaskList from "./SubtaskList";
import {FormSlideLeft} from "./styles/Form";
import {AccentBorderBottom} from "./styles/BorderStyles";
import {SecondaryText} from "./styles/Text";

const GOAL_TASK_QUERY = gql`
    query GOAL_TASK_QUERY (
        $id: ID!
    ) {
        task (id: $id){
            id
            name
            description
            goal {
                id
                name
            }
            dueDate
            complete
            subtasks {
                id
                name
                description
                complete
                dueDate
            }
        }
    }
`

const DELETE_TASK_MUTATION = gql`
    mutation DELETE_TASK_MUTATION (
        $id: ID!
    ) {
        deleteTask(id: $id){
            id
        }
    }
`

class Task extends Component {
    state = {
        showEdit: false,
    }

    toggleEdit = () => {
        const editState = this.state.showEdit
        this.setState({showEdit: !editState});
    }
    render() {
        return (
            <Query query={GOAL_TASK_QUERY} variables={ {id: this.props.id} }>
                { ({data, loading, error}) => {
                        if(error) return <Error error={error}/>;
                        if(loading) return <p>Loading...</p>;
                        const { task } = data; 
                        return (
                            <div>
                                <div style={{overflow:'hidden'}}>
                                    <AccentBorderBottom >
                                        <FlexCenterBetween>
                                            <h3>Milestone to achieve {task.goal.name}</h3>
                                            <div>
                                                {this.state.showEdit && (
                                                <Mutation mutation={DELETE_TASK_MUTATION} variables={ {id: task.id} }>
                                                    {
                                                        (deleteTask, {deleteError, deleteLoading}) => {
                                                            if(deleteError) return <Error error={deleteError}/>;
                                                            if(deleteLoading) return <p>Loading...</p>;
                                                            return <SickButton onClick={()=>{
                                                                deleteTask();
                                                                Router.push({
                                                                    pathname: "/goal",
                                                                    query: {id: task.goal.id}
                                                                })
                                                            }}>Delete</SickButton>
                                                        }
                                                    }
                                                </Mutation>)}
                                                <SickButton onClick={this.toggleEdit}>{this.state.showEdit? 'Cancel' : 'Edit'}</SickButton>
                                            </div>
                                        </FlexCenterBetween>
                                    </AccentBorderBottom>
                                    <Flex>
                                        { !this.state.showEdit && 
                                            (<div>
                                            <p>{task.name}</p>
                                            <SecondaryText>{task.description}</SecondaryText>
                                            <p>Due Date:<FormattedDate value={task.dueDate}></FormattedDate></p>
                                            {/* Add in how much has been done, duedate */}
                                            </div>)
                                        }
                                        <FormSlideLeft showing={this.state.showEdit}>
                                            <UpdateTask task={task}/>
                                        </FormSlideLeft>  
                                    </Flex>    
                                </div>
                                <div>
                                    {
                                       task.subtasks && <SubtaskList subtasks={task.subtasks} taskId={task.id}/>
                                    }
                                    
                                </div>
                            </div> 
                        ) 
                    }
                }
            </Query>
        );
    }
}

export default Task;
export { GOAL_TASK_QUERY };