import React, { Component } from 'react';
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import styled from "styled-components";
import Form from "./styles/Form"; 
import Error from "./ErrorMessage";
import {CURRENT_USER_QUERY} from "./User";

const SIGNIN_MUTATION = gql`
    mutation SIGNIN_MUTATION(
        $email: String!
        $password: String!
    ){
        signin(email: $email, password: $password){
            id
            email
            name 
        }
    }
`

class SigninForm extends Component {
    state = {
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
            <Mutation mutation={SIGNIN_MUTATION} 
                      variables={this.state}
                      refetchQueries={[{query: CURRENT_USER_QUERY }]}>
                { (signin, {error, loading})=> {
                        if(error) return <Error error={error}/>
                        if(loading) return <p>Loading...</p>
                        return (<Form method="post" onSubmit={ async e =>{
                            e.preventDefault();
                            await signin();
                            this.setState({email: "", password: ""});
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
                                    Password
                                    <input 
                                    type="password" 
                                    name="password" 
                                    placeholder="Password"
                                    value={this.state.password}
                                    onChange={this.stateChange}/>
                                </label>
                            </fieldset>
                            <button>Sign In!</button>
                        </Form>)
                    }
                }
            </Mutation>
            
        );
    }
}

export default SigninForm;