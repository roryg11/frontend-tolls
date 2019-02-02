import React, { Component } from 'react';
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import styled from "styled-components";
import Form from "./styles/Form"; 
import Error from "./ErrorMessage";

const FormStyles = styled.div`

`

const SIGNUP_MUTATION = gql`
    mutation SIGNUP_MUTATION(
        $name: String!
        $email: String!
        $password: String!
    ){
        signup(name: $name, email: $email, password: $password){
            id
            email
            name 
        }
    }
`

class SignupForm extends Component {
    state = {
        name: "",
        email: "",
        password: ""
    }

    stateChange = (e) => {
        e.preventDefault();
        const prop = e.target.name; 
        this.setState({
            [prop]: e.target.value
        });
    }

    render() {
        return (
            <Mutation mutation={SIGNUP_MUTATION} variables={this.state}>
                { (signup, {error, loading})=> {
                        if(error) return <Error error={error}/>
                        if(loading) return <p>Loading...</p>
                        return (<Form method="post" onSubmit={ async e =>{
                            e.preventDefault();
                            await signup();
                            this.setState({name: "", email: "", password: ""});
                        }}>
                            <fieldset disabled={loading} aria-busy={loading}>
                                <label>
                                    Email
                                    <input 
                                    type="text" 
                                    name="email" 
                                    placeholder="Email"
                                    value={this.state.email}
                                    onChange={this.stateChange}/>
                                </label>
                                <label>
                                    Name
                                    <input 
                                    type="text" 
                                    name="name" 
                                    placeholder="Name"
                                    value={this.state.name}
                                    onChange={this.stateChange}/>
                                </label>
                                <label>
                                    Password
                                    <input 
                                    type="password" 
                                    name="password" 
                                    placeholder="Password"
                                    value={this.state.password}
                                    onChange={this.stateChange}/>
                                </label>
                            </fieldset>
                            <button>Sign Up!</button>
                        </Form>)
                    }
                }
            </Mutation>
            
        );
    }
}

export default SignupForm;