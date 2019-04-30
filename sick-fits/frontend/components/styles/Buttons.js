import styled from 'styled-components';

const PrimaryButton = styled.button`
  background: ${props => props.theme.accentColor};
  color: white;
  font-weight: 500;
  height: 4.5rem;
  text-transform: uppercase;
  font-size: 2rem;
  padding: 0.8rem 1.5rem;
  display: inline-block;
  transition: all 0.5s;
  &[disabled] {
    opacity: 0.5;
  }
`

const SecondaryButton = styled.button`
    background: white;
    color: ${props => props.theme.accentColor};
    border: 1px solid ${props => props.theme.accentColor};
    font-weight: 500;
    text-transform: uppercase;
    font-size: 2rem;
    height: 4.5rem;
    padding: 0.8rem 1.5rem;
    display: inline-block;
    transition: all 0.5s;
    &[disabled] {
        opacity: 0.5;
    }
`
export {SecondaryButton}
export {PrimaryButton};
