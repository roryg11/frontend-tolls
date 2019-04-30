import React, { Component } from 'react';
import styled from "styled-components";
import {FormattedDate} from "react-intl";
import { TransitionGroup, CSSTransition} from "react-transition-group";
import { MEASUREMENTS } from "./CreateGoal";
import {SecondaryText} from "./styles/Text";

class GoalDetail extends Component {
    render() {
        const { goal } = this.props;
            return (
                <div>
                    <div> 
                        <p>WHY?</p> 
                        <SecondaryText>{goal.description}</SecondaryText>
                    </div>
                    <div> 
                        <p>Due Date: { goal.dueDate && (<FormattedDate value={goal.dueDate}/>)} </p> 
                    </div>
                    <div>How will I measure my success?
                        { (goal.measurement ===  MEASUREMENTS.frequency) && <span>By building habits</span>}
                        { (goal.measurement ===  MEASUREMENTS.list) && <span>By working through a to-do list</span>}
                    </div>
                </div>
            );
    }
    
}

export default GoalDetail;