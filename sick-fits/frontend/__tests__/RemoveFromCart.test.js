import {mount} from "enzyme";
import toJSON from "enzyme-to-json";
import { ApolloConsumer } from "react-apollo";
import { MockedProvider } from "react-apollo/test-utils";
import wait from "waait";
import RemoveFromCart, { REMOVE_FROM_CART_MUTATION }  from "../components/RemoveFromCart";
import {CURRENT_USER_QUERY} from "../components/User";
import { fakeUser, fakeCartItem, fakeItem } from "../lib/testUtils";

const user = fakeUser();
const cartItem = fakeCartItem();


const mocks = [
    {
        request: { query: CURRENT_USER_QUERY },
        result: {
            data: {
                me: {
                    ...user,
                    cart: [cartItem]
                },
                
            }
        }
    },
    {
        request: { query: REMOVE_FROM_CART_MUTATION, variables: {id: cartItem.id}},
        result: {
            data: {
                removeFromCart: {
                    id: cartItem.id
                }
            } 
        }
    }
];

describe('<RemoveFromCart/>', ()=>{
    it('renders and matches snapshot', ()=>{
        const wrapper = mount(
            <MockedProvider>
                <RemoveFromCart id={cartItem.id}/>
            </MockedProvider>
        );

        expect(toJSON(wrapper)).toMatchSnapshot();
    });

    it('removes item from users cart', async ()=>{
        let apolloClient;
        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <ApolloConsumer>
                    { (client)=>{
                        apolloClient = client;
                        return(
                            <RemoveFromCart id={cartItem.id}/>
                        )
                    }}
                </ApolloConsumer>
            </MockedProvider>
        );

        await wait();
        wrapper.update();

        const {data: {me: currentUser}} = await apolloClient.query({query: CURRENT_USER_QUERY});
        expect(currentUser.cart.length).toEqual(1);

        wrapper.find('button').simulate('click');

        await wait();
        wrapper.update();

        const {data: {me: updatedUser}} = await apolloClient.query({query: CURRENT_USER_QUERY});
        expect(updatedUser.cart.length).toEqual(0);
    });
});