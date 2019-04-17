import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from "graphql-tag";
import Router from "next/router";
import styled from "styled-components";
import Form from "./styles/Form";

const CREATE_TASK_MUTATION = gql`
    mutation CREATE_TASK_MUTATION (
        $name: String!
        $description: String
        $goalId: ID!
    ) {
        createTask(
            name: $name
            description: $description
            goalId: $goalId
        ) {
            id
            name
            description
        }
    }
`


class CreateTask extends Component {
    state = {
        name: "",
        description: "",
        goalId: this.props.goalId
    }

    handleChange = (e) => {
        const { name, value } = e.target; 
        this.setState({[name]: value});
    }

    render() {
        return (
            <Mutation mutation={CREATE_TASK_MUTATION} variables={this.state}>
                { (createTask, {loading, error})=>{
                        return (<Form onSubmit={
                                        async e=> {
                                            // stop form from submitting
                                            e.preventDefault();
                                            //call the mutation
                                            const res = await createTask();
                                            // change to the single item page
                                            Router.push({
                                                pathname: "/milestone", 
                                                query: {id: res.data.createTask.id}
                                            });
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
                                    value={this.state.title}
                                    onChange={this.handleChange}/>
                                </label>
                                <label htmlFor="description">
                                    Description
                                    <textarea
                                    id="description"
                                    name="description"
                                    placeholder="Enter a description"
                                    required
                                    value={this.state.description}
                                    onChange={this.handleChange}/>
                                </label>
                                <button type="Submit">Submit</button>
                            </fieldset>
                        </Form>)
                    }
                }
            </Mutation>
        );
    }
}

export default CreateTask;