import React, { Component } from 'react';
import gql from "graphql-tag";
import { Mutation } from "react-apollo"; 
import Form from "./styles/Form";
import Error from "./ErrorMessage";

const UPDATE_TASK_MUTATION = gql`
    mutation UPDATE_TASK_MUTATION(
        $id: ID!
        $name: String
        $description: String
        $dueDate: DateTime
        $complete: Boolean 
    ) {
        updateTask(
            id: $id
            name: $name
            description: $description
            dueDate: $dueDate
            complete: $complete
        ) {
            id
            name
            description
            dueDate
            complete
        }
    }
`

class UpdateTask extends Component {
    state = {
        id: this.props.task.id
    }
    handleChange = (e) => {
        const {name, value} = e.target;
        this.setState({[name]: value});
    }
    render() {
        return (
            <Mutation mutation={UPDATE_TASK_MUTATION} variables={this.state}>
                {(updateTask, {loading, error})=>{
                    if(error) return <Error error={error}/>;
                    return (
                        <Form onSubmit={
                            async e=> {
                                // stop form from submitting
                                e.preventDefault();
                                //call the mutation
                                const res = await updateTask();
                            }
                        }>
                        <fieldset disabled={loading} aria-busy={loading}>
                            <label htmlFor="name">
                                Name
                                <input type="text"
                                id="name"
                                name="name"
                                placeholder="name"
                                required
                                defaultValue={this.props.task.name}
                                onChange={this.handleChange}/>
                            </label>
                            <label htmlFor="description">
                                Description
                                <textarea
                                id="description"
                                name="description"
                                placeholder="Enter a description"
                                required
                                defaultValue={this.props.task.description}
                                onChange={this.handleChange}/>
                            </label>
                            <label htmlFor="dueDate">
                                Due Date
                                <input type="date"
                                id="dueDate"
                                name="dueDate"
                                defaultValue={this.props.task.dueDate}
                                onChange={this.handleChange}/>
                            </label>
                            <button type="Submit">Submit</button>
                        </fieldset>
                    </Form>
                    )
                }}
            </Mutation>
        );
    }
}

export default UpdateTask;