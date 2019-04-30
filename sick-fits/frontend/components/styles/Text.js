import styled from "styled-components";

// make font atoms with this kind of thing
const SecondaryText = styled.div`
    font-family: Lato;
    font-style: italic;
    font-size: 15px;
    color: black; 
    padding-left: 10px;
`

// will need to change this
const PrimaryText = styled.div`
    font-family: Radnika-next;
    font-size: 20px;
`

const PrimaryTextUnderLine = styled.h3`
    border-bottom: {props=> props.theme.accentColor} solid 3px;
    margin: 0;
`
export {SecondaryText};
export {PrimaryTextUnderLine};
export default PrimaryText;