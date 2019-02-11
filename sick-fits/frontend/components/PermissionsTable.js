import React, { Component } from 'react';
import gql from "graphql-tag";
import { Query } from "react-apollo";
import Error from "./ErrorMessage";
import Table from "./styles/Table";
import SickButton from "./styles/SickButton";

const ALL_USERS_QUERY = gql`
    query ALL_USERS_QUERY {
        users {
            id
            name
            email
            permissions
        }
    }
`;

const permissions = [
    "ADMIN",
    "USER",
    "ITEMCREATE",
    "ITEMUPDATE",
    "ITEMDELETE",
    "PERMISSIONUPDATE"
];

class User extends Component {
    render(){
        const user = this.props.user;
        console.log(user);
        return (<tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    { permissions.map((userPermission) => {
                        return (<td>
                                    <label htmlFor={`${user.id}-${userPermission}`}>
                                        <input type="checkbox"/>
                                    </label>
                                </td>);
                    })}
                    <td>
                        <SickButton>Update</SickButton>
                    </td>
                </tr>);
    }
};

class PermissionsTable extends Component {
    render() {
        return (
            <Query query={ALL_USERS_QUERY}>
            { ({data: {users}, error, loading}) => {
                    if(error) return <Error error={error}/>
                    if(loading) return <p>Loading...</p>
                    return(
                        <Table>
                            <thead>
                                <tr>
                                    <td>Name</td>
                                    <td>Email</td>
                                    { permissions.map((permission, index)=>{
                                        return <td key={index}>{permission}</td>
                                    })}
                                    <td>&nbsp;</td>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    users.map((user)=>{
                                        return (<User user={user} key={user.id}/>);
                                    })
                                }
                            </tbody>
                        </Table>
                    ); 
                }
            }
            </Query>
        );
    }
}

export default PermissionsTable;