import CreateTask from "../components/CreateTask";

const AddMilestone = (props) => {
    return(
        <CreateTask goalId={props.query.id}/>
    )
}

export default AddMilestone;