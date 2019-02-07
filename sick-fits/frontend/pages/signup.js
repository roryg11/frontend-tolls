import styled from "styled-components";
import SignupForm from "../components/SignupForm";
import SigninForm from "../components/SigninForm";
import RequestReset from "../components/RequestReset";



const Columns = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    grid-gap: 20px;
`

const Signup  = props => (
    <Columns>
        <SignupForm/>
        <SigninForm/>
        <RequestReset/>
    </Columns>
)

export default Signup;