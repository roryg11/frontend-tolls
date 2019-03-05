import React, { Component } from 'react';
import gql from "graphql-tag";
import { Query, Mutation } from "react-apollo";
import Error from "./ErrorMessage";
import Table from "./styles/Table";
import SickButton from "./styles/SickButton";
import PropTypes from "prop-types";

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

const UPDATE_PERMISSIONS_MUTATION = gql`
    mutation UPDATE_PERMISSIONS_MUTATION (
        $permissions: [Permission]!,
        $userId: ID!
    ) {
        updatePermissions(permissions: $permissions, userId: $userId){
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

class UserPermission extends Component {
    static propTypes = {
        user: PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            email: PropTypes.string.isRequired,
            permissions: PropTypes.array.isRequired
        }).isRequired
    }

    state = {
        permissions: this.props.user.permissions
    }

    onCheckBoxChange = e => {
        let updatedPermissions = [...this.state.permissions];
        if(e.target.checked){
            updatedPermissions.push(e.target.value);
        } else {
            updatedPermissions = updatedPermissions.filter(permission => permission !== e.target.value);
        }
        this.setState({permissions: updatedPermissions});
    }

    render(){
        const user = this.props.user;
        return (<Mutation mutation={UPDATE_PERMISSIONS_MUTATION} variables={ {permissions: this.state.permissions, userId: this.props.user.id} }>
            { (updatePermissions, {error, loading})=>{
                if(error) <Error error={error}/>;
                if(loading) <p>Loading...</p>;
                return(
                    <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    { permissions.map((userPermission) => {
                        return (<td key={userPermission}>
                                    <label htmlFor={`${user.id}-permission-${userPermission}`}>
                                        <input id={`${user.id}-permission-${userPermission}`} 
                                        type="checkbox" 
                                        value={userPermission}
                                        checked={this.state.permissions.includes(userPermission)} 
                                        onChange={this.onCheckBoxChange}/>
                                    </label>
                                </td>);
                    })}
                    <td>
                        <SickButton type="button" disabled={loading} onClick={updatePermissions}>Update</SickButton>
                    </td>
                    </tr>
                )
            }}
        </Mutation>
        );
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
                                        return (<UserPermission user={user} key={user.id}/>);
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