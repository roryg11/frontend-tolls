import React, { Component } from 'react';
import { CSSTransition, TransitionGroup} from "react-transition-group";
import styled from "styled-components";
import SingleSubtask from "./SingleSubtask";
import AddSubtask from "./AddSubtask";
import {FlexCenterAlign} from "./styles/FlexUtilities";
import {AccentBorderBottom} from "./styles/BorderStyles";

const FadeIn = styled.div`
    padding: 10px;
    .subtask-enter {
        opacity: 0;
    }

    .subtask-enter-active {
        opacity: 1;
        transition: opacity 4s;
    }

    .subtask-exit{
        opacity: 1;
    }

    .subtask-exit-active{
        opacity: 0;
        transition: opacity 4s; 
    }
`

class subtaskList extends Component {
    render() {
        const {subtasks} = this.props;
        return (
            <div>
                <AccentBorderBottom>
                    <FlexCenterAlign>
                        <h3 style={{margin: "5px"}}> Subtasks </h3>
                        <AddSubtask taskId={this.props.taskId}/>
                    </FlexCenterAlign>
                </AccentBorderBottom>      
                <FadeIn>
                    <TransitionGroup>
                        {subtasks.map((subtask)=>{
                            return (
                                
                                    <CSSTransition 
                                        key={subtask.id}
                                        unmountOnExit
                                        className="subtask" 
                                        classNames="subtask"
                                        timeout={{enter: 400, exit: 400}}>
                                        <SingleSubtask subtask={subtask} taskId={this.props.taskId}/>
                                    </CSSTransition>
                            )
                        })}
                    </TransitionGroup>  
            </FadeIn>
            </div>
            
        );
    }
}

export default subtaskList;