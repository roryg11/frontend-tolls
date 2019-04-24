import styled from "styled-components";

const StandardBorderBottom = styled.div`
    border-bottom: 1px solid ${props => props.theme.lightgrey};
`

const AccentBorderBottom = styled.div`
    border-bottom: 3px solid ${props => props.theme.accentColor};
`

export {StandardBorderBottom};
export {AccentBorderBottom};