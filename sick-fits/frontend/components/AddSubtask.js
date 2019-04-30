import React, { Component } from 'react';
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import styled from "styled-components";
import Form from "./styles/Form";
import Error from "./ErrorMessage";
import SickButton from "./styles/SickButton";
import FormDialog from "./FormDialog";
import AddButton from "./styles/AddButton";
import { GOAL_TASK_QUERY } from "./Task";

const CREATE_SUBTASK_MUTATION = gql`
    mutation CREATE_SUBTASK_MUTATION (
        $name: String!
        $description: String
        $taskId: ID!
        $dueDate: DateTime
    ) {
        createSubTask(
            name: $name
            description: $description
            taskId: $taskId
            dueDate: $dueDate
        ) {
            id
            name
            description
            dueDate
        }
    }
`

const FormStyles = styled.div`
    padding: 20px;
`

class AddSubtask extends Component {
    state = {
        isOpen: false,
        taskId: this.props.taskId,
        name: "",
        description: "",
        dueDate: null
    }

    handleClickOpen = () => {
        this.setState({isOpen: true});
    }

    closeFn = () => {
        this.setState({isOpen: false});
    }

    onChange = (e) => {
        const {name, value} = e.target; 
        this.setState({[name]: value});
    }
    render() {
        // will need to add refetch queries and animate the appearance of the subtask
        return (
            <div>
                <AddButton onClick={this.handleClickOpen}>+</AddButton>
                <FormDialog isOpen={this.state.isOpen} closeFn={this.closeFn}>
                    <Mutation mutation={CREATE_SUBTASK_MUTATION} refetchQueries={[{query: GOAL_TASK_QUERY, variables: {id: this.props.taskId}}]}>
                        { (addSubtask, {loading, error}) => {
                            if(loading) return <p>Loading...</p>;
                            if(error) return <Error error={error}/>;
                            return (
                                <FormStyles>
                                    <Form onSubmit={
                                    async (e)=>{
                                        e.preventDefault();
                                        const { name, description, dueDate} = this.state; 
                                        const rest = await addSubtask({
                                            variables: {
                                                taskId: this.props.taskId,
                                                name,
                                                description,
                                                dueDate
                                            }
                                        });
                                        this.closeFn();
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
                                            <label htmlFor="dueDate">
                                                Due Date
                                                <input type="date"
                                                id="dueDate"
                                                name="dueDate"
                                                defaultValue={new Date()}
                                                onChange={this.onChange}/>
                                            </label>
                                            <SickButton type="Submit">Add Subtask</SickButton>
                                    </Form>
                                </FormStyles>
                                
                            )
                        }}
                    </Mutation>
                </FormDialog>
            </div>
            
        );
    }
}

export default AddSubtask;