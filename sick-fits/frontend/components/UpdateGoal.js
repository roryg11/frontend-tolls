import React, { Component } from 'react';
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import styled from "styled-components";
import Form from "./styles/Form";
import PropTypes from "prop-types";
import { TransitionGroup, CSSTransition} from "react-transition-group";
import { MEASUREMENTS } from "./CreateGoal";
import Error from "./ErrorMessage";

const UPDATE_GOAL_MUTATION = gql`
    mutation UPDATE_GOAL_MUTATION(
        $id: ID!
        $name: String
        $description: String
        $measurement: Measurement,
        $dueDate: DateTime
    ) {
        updateGoal(
            id: $id
            name: $name
            description: $description
            measurement: $measurement
            dueDate: $dueDate
        ){
            id
            name
            description
            measurement
            dueDate
        }
    }
`

class UpdateGoal extends Component {
    state = {}
    handleChange = (e) => {
        const {name, value} = e.target;
        this.setState({[name]: value});
    }

    handleUpdate = async (e, updateMutation) => {
        e.preventDefault();
        const {id} = this.props.goal;
        const res = await updateMutation({
            variables: {
                id,
                ...this.state
            }
        });
        this.props.updatedCb();
    }

    render() {
        const { goal } = this.props
        return (
            <Mutation mutation={UPDATE_GOAL_MUTATION}>
                { (updateGoal, {error, loading}) => {
                        if(error) return <Error error={error}/>;
                        if(loading) return <p>Loading...</p>;
                        return (
                            <Form onSubmit={ (e) => {
                                this.handleUpdate(e, updateGoal);
                            }}>
                                <fieldset disabled={loading} aria-busy={loading}>
                                    <label htmlFor="name">
                                        Name
                                        <input type="text"
                                        id="name"
                                        name="name"
                                        placeholder="name"
                                        required
                                        defaultValue={goal.name}
                                        onChange={this.handleChange}/>
                                    </label>
                                    <label htmlFor="description">
                                        WHY? What is the purpose of this goal? 
                                        <input type="text"
                                        id="description"
                                        name="description"
                                        placeholder="to make my life better"
                                        required
                                        defaultValue={goal.description}
                                        onChange={this.handleChange}/>
                                    </label>
                                    <label htmlFor="dueDate">
                                        Due Date
                                        <input type="date"
                                        id="dueDate"
                                        name="dueDate"
                                        defaultValue={goal.dueDate}
                                        onChange={this.handleChange}/>
                                    </label>
                                    <label htmlFor="measurement">
                                        Measurement - how do you measure your success?
                                    <select onChange={this.handleChange} name="measurement" defaultValue={goal.measurement}>
                                        {
                                            MEASUREMENTS.map((measurement)=>{
                                                return <option key={measurement} value={measurement}>{measurement}</option>;    
                                            })
                                        }
                                    </select>
                                </label>
                                    <button type="Submit">Sav{loading? 'ing' : 'e'} Changes</button>
                                </fieldset>
                            </Form>                           
                        )
                    }
                }
            </Mutation>
            
                                   
        );
    }
}

export default UpdateGoal;