import React, { Component } from 'react';
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { CURRENT_USER_QUERY } from "./User";
import Form from "./styles/Form"; 
import Error from "./ErrorMessage";

const RESET_MUTATION = gql`
    mutation RESET_MUTATION(
        $password: String!
        $passwordConfirmation: String!
        $resetToken: String!
    ){
        resetPassword(password: $password, passwordConfirmation: $passwordConfirmation, resetToken: $resetToken){
            id
            name 
            email
        }
    }
`

class ResetPassword extends Component {
    state = {
        password: "",
        passwordConfirmation: ""
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
            <Mutation mutation={RESET_MUTATION} 
                      variables={{
                          resetToken: this.props.resetToken, 
                          password: this.state.password, 
                          passwordConfirmation: this.state.passwordConfirmation
                        }}
                        refetchQueries={[{query: CURRENT_USER_QUERY}]}>
                { (reset, {error, loading, called})=> {
                        if(error) return <Error error={error}/>
                        if(called) return <p>password has been reset!</p>
                        return (<Form method="post" onSubmit={ async e =>{
                            e.preventDefault();
                            await reset();
                            this.setState({password: "", passwordConfirmation: ""});
                        }}>
                            <fieldset>
                                <label>
                                    Password
                                    <input 
                                    type="password" 
                                    name="password" 
                                    placeholder="Password"
                                    value={this.state.password}
                                    onChange={this.stateChange}/>
                                </label>
                                <label>
                                    Password Confirmation
                                    <input 
                                    type="password" 
                                    name="passwordConfirmation" 
                                    placeholder="Password Confirmation"
                                    value={this.state.passwordConfirmation}
                                    onChange={this.stateChange}/>
                                </label>
                            </fieldset>
                            <button>Change Password</button>
                        </Form>)
                    }
                }
            </Mutation>
            
        );
    }
}

export default ResetPassword;