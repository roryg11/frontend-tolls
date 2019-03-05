import {mount} from "enzyme";
import toJSON from "enzyme-to-json";
import { ApolloConsumer } from "react-apollo";
import { MockedProvider } from "react-apollo/test-utils";
import Router from "next/router";
import NProgress from "nprogress";
import wait from "waait";
import TakeMyMoney, { CREATE_ORDER_MUTATION }  from "../components/TakeMyMoney";
import {CURRENT_USER_QUERY} from "../components/User";
import { fakeUser, fakeCartItem, fakeItem, fakeOrder } from "../lib/testUtils";

Router.router = {
    push(){}
}

const mocks = [
    {
        request: {query: CURRENT_USER_QUERY},
        result: {
            data: {
                me: {
                    ...fakeUser(),
                    cart: [fakeCartItem()]
                }
            }
        }
    },
    {
        request: {query: CREATE_ORDER_MUTATION, variables: { token: 'abc123'}},
        result: {
            data: {
                createOrder: fakeOrder()
            }
        }
    }
];

describe('<TakeMyMoney/>', ()=>{
    it('renders and matches snapshot', async ()=>{
        const wrapper = mount(
        <MockedProvider mocks={mocks}>
            <TakeMyMoney/>
        </MockedProvider>);

        await wait();
        wrapper.update();
        const checkoutButton = wrapper.find('ReactStripeCheckout');
        expect(toJSON(checkoutButton)).toMatchSnapshot();
    });
    it('creates an order when the checkout button is clicked', async ()=>{
        const createOrderMock = jest.fn().mockResolvedValue({
            data: {
                createOrder: {
                    id: 'xyz789'
                }
            }
        }); 
        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <TakeMyMoney/>
            </MockedProvider>);
    
            await wait();
            wrapper.update();

            // here we are replacing the createOrder fn and then calling the onToken method
            // as if we had received it back from stripe
            const component = wrapper.find('TakeMyMoney').instance();
            component.onToken({id: 'abc123' }, createOrderMock);
            expect(createOrderMock).toHaveBeenCalledWith({variables: {token: 'abc123'}});
    });
    it('should show a progress bar when the checkout button is clicked', async ()=>{
        const createOrderMock = jest.fn().mockResolvedValue({
            data: {
                createOrder: {
                    id: 'xyz789'
                }
            }
        }); 
        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <TakeMyMoney/>
            </MockedProvider>);
    
        await wait();
        wrapper.update();

        NProgress.start = jest.fn();

        // here we are replacing the createOrder fn and then calling the onToken method
        // as if we had received it back from stripe
        const component = wrapper.find('TakeMyMoney').instance();
        component.onToken({id: 'abc123' }, createOrderMock);
        expect(NProgress.start).toHaveBeenCalled();
    });

    it('routes to another page when user has chekced out', async ()=>{
        const createOrderMock = jest.fn().mockResolvedValue({
            data: {
                createOrder: {
                    id: 'xyz789'
                }
            }
        }); 
         // mocking router
        Router.router.push = jest.fn();

        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <TakeMyMoney/>
            </MockedProvider>);
    
        await wait();
        wrapper.update();

        // here we are replacing the createOrder fn and then calling the onToken method
        // as if we had received it back from stripe
        const component = wrapper.find('TakeMyMoney').instance();
        component.onToken({id: 'abc123' }, createOrderMock);
        await wait();
        expect(Router.router.push).toHaveBeenCalledWith({
            pathname: "/orderPage",
            query: {
                id: 'xyz789'
            }
        });
    });
})
