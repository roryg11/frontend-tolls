import { CURRENT_USER_QUERY } from "./User";
import { Query } from "react-apollo";
import SigninForm from "./SigninForm";

const PleaseSignin = props => (
    <Query query={CURRENT_USER_QUERY}>
        {
            ({data, loading})=>{
                if(loading) return <p>Loading...</p>
                if(!data.me){
                    return <div>
                            <p>Please sign in before continuing</p>
                            <SigninForm/>
                        </div>
                }

                return props.children
            }
        }
    </Query>
)

export default PleaseSignin;