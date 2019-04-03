import React, { Component } from 'react';
import styled from "styled-components";
import { MEASUREMENTS } from "./CreateGoal";
import { TransitionGroup, CSSTransition} from "react-transition-group";


const GoalDescription = styled.span`
    font-weight: 100;
`

class GoalDetail extends Component {
    componentDidMount(){
        console.log("GOAL DETAIL MOUNTING");
    }

    componentWillUnmount(){
        console.log("GOAL DETAIL ABOUT TO UNMOUNT!")
    }
    render() {
        const { goal } = this.props;
        return (
            <div>
                <div>Click Count = {this.props.clickCount}</div>
                <div> <h4>WHY?</h4> <GoalDescription>{goal.description}</GoalDescription></div>
                <div> <h4>Due Date:</h4> {goal.dueDate} NEED A CALENDAR WIDGET HERE</div>
                <div>How will I measure my success?
                    { (goal.measurement ===  MEASUREMENTS.frequency) && <span>By building habits</span>}
                    { (goal.measurement ===  MEASUREMENTS.list) && <span>By working through a to-do list</span>}
                </div>
                <p>What success looks like: NEED TO ADD THIS TO GOAL CREATION</p>
            </div>
        );
    }
}

export default GoalDetail;