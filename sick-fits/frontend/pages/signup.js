import SignupForm from "../components/SignupForm";
import styled from "styled-components";

const Columns = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    grid-gap: 20px;

`

const Signup  = props => (
    <Columns>
        <SignupForm/>
        <SignupForm/>
        <SignupForm/>
    </Columns>
)

export default Signup;