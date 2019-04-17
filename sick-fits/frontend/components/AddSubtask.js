import React, { Component } from 'react';
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import styled from "styled-components";
import Form from "./styles/Form";
import Error from "./ErrorMessage";
import SickButton from "./styles/SickButton";
import { GOAL_TASK_QUERY } from "./Task";

const CREATE_SUBTASK_MUTATION = gql`
    mutation CREATE_SUBTASK_MUTATION (
        $name: String!
        $description: String
        $taskId: ID!
    ) {
        createSubTask(
            name: $name
            description: $description
            taskId: $taskId
        ) {
            id
            name
            description
        }
    }
`

const FormStyles = styled.div`
    padding: 20px;
`

class AddSubtask extends Component {
    state = {
        taskId: this.props.taskId,
        name: "",
        description: ""
    }

    onChange = (e) => {
        const {name, value} = e.target; 
        this.setState({[name]: value});
    }
    render() {
        // will need to add refetch queries and animate the appearance of the subtask
        return (
            <Mutation mutation={CREATE_SUBTASK_MUTATION} variables={this.state} refetchQueries={[{query: GOAL_TASK_QUERY, variables: {id: this.props.taskId}}]}>
                { (addSubtask, {loading, error}) => {
                    if(loading) return <p>Loading...</p>;
                    if(error) return <Error error={error}/>;
                    return (
                        <FormStyles>
                            <Form onSubmit={
                            (e)=>{
                                e.preventDefault();
                                addSubtask();
                            }
                            }>
                                <label htmlFor="name">
                                        Name
                                        <input type="text"
                                        id="name"
                                        name="name"
                                        placeholder="Name"
                                        required
                                        value={this.state.name}
                                        onChange={this.onChange}/>
                                    </label>
                                    <label htmlFor="description">
                                        Description
                                        <input type="text"
                                        id="description"
                                        name="description"
                                        placeholder="How does this help achieve your milestone?"
                                        required
                                        value={this.state.description}
                                        onChange={this.onChange}/>
                                    </label>
                                    <SickButton type="Submit">Add Subtask</SickButton>
                            </Form>
                        </FormStyles>
                        
                    )
                }}
            </Mutation>
        );
    }
}

export default AddSubtask;