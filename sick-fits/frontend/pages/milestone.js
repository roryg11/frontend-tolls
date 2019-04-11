import Task from "../components/Task";

const Milestone = props => (
    <div>
        <Task id={props.query.id}/>
    </div>
)

export default Milestone;