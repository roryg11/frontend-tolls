import gql from "graphql-tag";
import { Query } from "react-apollo";
import propTypes from "prop-types";

const CURRENT_USER_QUERY = gql`
    query {
        me{
            id
            name
            email
            permissions
            cart {
                id
                quantity
                item {
                    id
                    title
                    description
                    image
                    price
                }
            }
        }
    }
`

const User = props => (
    <Query query={CURRENT_USER_QUERY}>
        { payload => props.children(payload)}
    </Query>
)

User.propTypes = {
    children: propTypes.func.isRequired,
}

export default User;
export {CURRENT_USER_QUERY};