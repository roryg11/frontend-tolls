import React, { Component } from 'react';
import styled, { keyframes } from "styled-components";
import { CSSTransition, Transition} from "react-transition-group";
import AddButton from "./styles/AddButton";

const FadingBackground = styled.div`
    .background-fade {
        /* background-color: rgba(0, 0, 0, 0.5); */
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
    }

    .background-fade-enter {
        opacity: 0;
    }

    .background-fade-enter-active {
        opacity: 1;
        transition: opacity 400ms;
    }

    .background-fade-exit{
        opacity: 1;
    }

    .background-fade-exit-active{
        opacity: 0;
        transition: opacity 400ms; 
    }
`

const ModalContent = styled.div`
    .modal-content {
        position: absolute;
        border-radius: 15px;
        background-color: white;
        opacity: white; 
        margin: auto;
        top: ${props => props.top};
        left: ${props => props.left}
    }

    .modal-content-enter {
        height: 200px;
        width: 200px;
    }

    .modal-content-enter-active {
        height: 400px;
        width: 400px; 
        transition: all 400ms ease-in;
    }

    .modal-content-enter-done {
        height: 400px;
        width: 400px;
    }


    .modal-content-exit {
        height: 400px;
        width: 400px;
    }

    .modal-content-exit-active{
        height: 0px;
        width: 0px;
        transition: all 400ms ease-in;
    }
`

// props should be a open and close 
class FormDialog extends Component {  
    render() {
        return (
                <div>
                    <FadingBackground onClick={this.props.closeFn}>
                        <CSSTransition 
                            in={this.props.isOpen} 
                            timeout={400}
                            classNames="background-fade"
                            className="background-fade"
                            unmountOnExit>
                                    <div></div>
                        </CSSTransition>
                    </FadingBackground> 
                    <ModalContent top={this.modalButtonTop} left={this.modalButtonLeft}>
                        <CSSTransition
                            in={this.props.isOpen}
                            timeout={400}
                            classNames="modal-content"
                            className="modal-content"
                            unmountOnExit>
                            <div className="modal-content">
                                {this.props.children}
                            </div>
                        </CSSTransition>
                    </ModalContent>
                </div>                                    
            );
    }
}

export default FormDialog;