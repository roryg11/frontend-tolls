import React, { Component } from 'react';
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import Router from "next/router";
import Error from "./ErrorMessage";
import AddButton from "./styles/AddButton";
import UpdateTask from "./UpdateTask";
import SickButton from "./styles/SickButton";

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
            }
            dueDate
            complete
            subtasks {
                id
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
        showEdit: false
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
                                <div>
                                    <SickButton onClick={this.toggleEdit}>Edit</SickButton>
                                    <Mutation mutation={DELETE_TASK_MUTATION} variables={ {id: task.id} }>
                                        {
                                            (deleteTask, {deleteError, deleteLoading}) => {
                                                if(deleteError) return <Error error={deleteError}/>;
                                                if(deleteLoading) return <p>Loading...</p>;
                                                return <SickButton onClick={()=>{
                                                    deleteTask();
                                                    console.log(task.goal.id);
                                                    Router.push({
                                                        pathname: "/goal",
                                                        query: {id: task.goal.id}
                                                    })
                                                }}>Delete</SickButton>
                                            }
                                        }
                                    </Mutation>
                                </div>
                                <div>
                                    {
                                        !this.state.showEdit && (
                                            <div>
                                                <p>name: {task.name}</p>
                                                <p>description: {task.description}</p>
                                            </div>
                                        )
                                    }
                                    
                                    { !!this.state.showEdit && <UpdateTask task={task}/>}
                                </div>
                                <div>
                                    <h4> Subtasks <AddButton>+</AddButton></h4>
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