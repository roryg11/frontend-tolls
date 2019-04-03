import React, { Component } from 'react';
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Router from "next/router";
import styled from "styled-components";
import Error from "./ErrorMessage";
import Form from "./styles/Form";
import SickButton from "./styles/SickButton";

const MEASUREMENTS = [
    "FREQUENCY",
    "LIST"
]; 

const CREATE_GOAL_MUTATION = gql`
    mutation CREATE_GOAL_MUTATION(
        $name: String!
        $description: String!
        $measurement: Measurement
    ) {
        createGoal(
            name: $name,
            description: $description,
            measurement: $measurement
        ) {
            id
            name
        }
    }
`

// Future to-do, add inspiration images etc

class CreateGoal extends Component {
    state = {
        name: "",
        description: "",
        measurement: MEASUREMENTS.frequency
    }
    onChange = (e) => {
        const { name, value } = e.target; 
        this.setState({[name]: value}); 
    }
    render(){
        return(
            <Mutation mutation={CREATE_GOAL_MUTATION} variables={this.state}>
                { (createGoal, {loading, error}) => {
                        if(error) return <Error error={error}/>
                        if(loading) return <p>Loading...</p>
                        return (
                            <Form onSubmit={ async (e) => {
                                e.preventDefault();

                                const res = await createGoal();
                                Router.push({
                                    pathname: "/goal", 
                                    query: {id: res.data.createGoal.id}
                                });
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
                                    placeholder="Why is this your goal?"
                                    required
                                    value={this.state.description}
                                    onChange={this.onChange}/>
                                </label>
                                <label htmlFor="measurement">
                                    Measurement - how will you measure your success?
                                    <select onChange={this.onChange} name="measurement" defaultValue={MEASUREMENTS.frequency}>
                                        {
                                            MEASUREMENTS.map((measurement)=>{
                                                return <option key={measurement} value={measurement}>{measurement}</option>;    
                                            })
                                        }
                                    </select>
                                </label>
                                <SickButton type="Submit">Onward!</SickButton>
                            </Form>
                        )
                    }
                }
            </Mutation>
        )
    }
}

export default CreateGoal;
export {MEASUREMENTS}; 

