import React, { Component } from 'react';
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Form from "./styles/Form"; 
import Error from "./ErrorMessage";

const REQUEST_RESET_MUTATION = gql`
    mutation REQUEST_RESET_MUTATION(
        $email: String!
    ){
        requestReset(email: $email){
            message
        }
    }
`

class RequestReset extends Component {
    state = {
        email: "",
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
            <Mutation mutation={REQUEST_RESET_MUTATION} 
                      variables={this.state}>
                { (requestReset, {error, loading, called})=> {
                        if(error) return <Error error={error}/>
                        if(called) return <p>Check your email for a reset password link!</p>
                        return (<Form method="post" 
                        data-test="form"
                        onSubmit={ async e =>{
                            e.preventDefault();
                            await requestReset();
                            this.setState({email: ""});
                        }}>
                            <fieldset>
                                <label>
                                    Email
                                    <input 
                                    type="text" 
                                    name="email" 
                                    placeholder="Email"
                                    value={this.state.email}
                                    onChange={this.stateChange}/>
                                </label>
                            </fieldset>
                            <button>Request Password Reset</button>
                        </Form>)
                    }
                }
            </Mutation>
            
        );
    }
}

export default RequestReset;
export { REQUEST_RESET_MUTATION };