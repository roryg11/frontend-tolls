import ResetPassword from "../components/ResetPassword";

const Reset = props => (
    <div>
        <h3>Reset your password</h3>
        <ResetPassword resetToken={props.query.resetToken}/>
    </div>
)

export default Reset;