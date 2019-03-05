import PleaseSignin from "../components/PleaseSignin";
import OrdersList from "../components/OrdersList";

const Orders = props => (
    <div>
        <PleaseSignin>
            <OrdersList/>
        </PleaseSignin>
    </div>
)

export default Orders;