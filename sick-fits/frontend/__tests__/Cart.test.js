import {mount} from "enzyme";
import toJSON from "enzyme-to-json";
import { MockedProvider } from "react-apollo/test-utils";
import wait from "waait";
import Cart, { LOCAL_STATE_QUERY, TOGGLE_CART_MUTATION }  from "../components/RequestReset";
import {CURRENT_USER_QUERY} from "../components/User";
import { fakeUser, fakeCartItem } from "../lib/testUtils";

// did we need mocks
const mocks = [
    {
        request: { query: CURRENT_USER_QUERY },
        result: {
            data: {
                me: {
                    ...fakeUser(),
                    cart: [fakeCartItem()]
                }
            }
        }
    }
]
describe("<Cart/>", ()=>{
    it('renders and matches snapshot', async ()=>{
        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <Cart/>
            </MockedProvider>
        );

        await wait();
        wrapper.update();

        expect(toJSON(wrapper.find("CartStyles"))).toMatchSnapshot();
    });
});