import {shallow, mount} from "enzyme";
import toJSON from "enzyme-to-json";
import { MockedProvider } from "react-apollo/test-utils";
import wait from "waait";
import Router from "next/router";
import Order, { SINGLE_ORDER_QUERY } from "../components/Order";
import { fakeUser, fakeOrder } from "../lib/testUtils";
import {CURRENT_USER_QUERY} from "../components/User";


const order = fakeOrder();

const mocks = [
    {
        request: {
            query: SINGLE_ORDER_QUERY, 
            variables: { id: order.id }
        },
        result: {
            data: {
                order: order
            }
        }
    },
    {
        request: {
            query: CURRENT_USER_QUERY
        },
        result: {
            data: {
                me: fakeUser()
            }
        }
    }
];

describe('<Order/>', ()=>{
    it('renders and matches snapshot', async ()=>{
        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <Order id={order.id}/>
            </MockedProvider>
        );

        await wait();
        wrapper.update();
        expect(toJSON(wrapper.find('Order'))).toMatchSnapshot();
    });
});