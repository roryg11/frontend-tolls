import styled from "styled-components";

const AddButton = styled.button`
    background-color: ${(props) => props.theme.accentColor};
    border-radius: 50%;
    color: white; 
    padding: 0.5rem;
    line-height: 2rem;
    width: 3rem;
    margin-left: 1rem;
    font-weight: 100;
    font-feature-settings: tnum;
    font-variant-numeric: tabular-nums;
`

export default AddButton;