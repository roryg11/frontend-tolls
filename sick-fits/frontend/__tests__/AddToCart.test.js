import {mount} from "enzyme";
import toJSON from "enzyme-to-json";
import { ApolloConsumer } from "react-apollo";
import { MockedProvider } from "react-apollo/test-utils";
import wait from "waait";
import AddToCart, { ADD_TO_CART_MUTATION }  from "../components/AddToCart";
import {CURRENT_USER_QUERY} from "../components/User";
import { fakeUser, fakeCartItem, fakeItem } from "../lib/testUtils";

const item = fakeItem();
const cartItem = fakeCartItem();

const mocks = [
    {
        request: {
            query: CURRENT_USER_QUERY
        },
        result: {
            data: {
                me: fakeUser()
            }
        }
    }, {
        request: {
            query: CURRENT_USER_QUERY
        },
        result: {
            data: {
                me: {
                    ...fakeUser(),
                    cart: [cartItem]
                }
            }
        }
    },
    {
        request: {
            query: ADD_TO_CART_MUTATION,
            variables: {
                id: item.id
            }
        },
        result: { 
            data: { 
                addToCart: {
                    __typename: "CartItem",
                    id: cartItem.id,
                    quantity: cartItem.quantity
                }
            }
        }
    }
]
describe('<AddToCart/>', ()=>{
    it('renders and matches snapshot', ()=>{
        const wrapper = mount(
            <MockedProvider>
                <AddToCart id={item.id}/>
            </MockedProvider>
        );

        const addButton = wrapper.find('AddToCart'); 

        expect(toJSON(addButton)).toMatchSnapshot();
    });
    it('is disabled while waiting for item to be added to cart', ()=>{
        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <AddToCart id={item.id}/>
            </MockedProvider>
        );

        wrapper.find('button').simulate('click');
        expect(wrapper.find('button').contains("Adding"));
        expect(wrapper.find('button').props().disabled).toBe(true);
    });

    it('calls mutation', async ()=>{
        let apolloClient;
        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <ApolloConsumer>
                    { (client)=>{
                        apolloClient = client;
                        return <AddToCart id={item.id}/>;
                        }
                    }
                </ApolloConsumer>
            </MockedProvider>
        );

        // check users cart
        const currentUser = await apolloClient.query({query: CURRENT_USER_QUERY});
        expect(currentUser.data.me.cart.length).toEqual(0); 

        wrapper.find('button').simulate('click');
        await wait();
        wrapper.update();

        const {data: {me: updatedUser}} = await apolloClient.query({query: CURRENT_USER_QUERY});
        await wait(); 
        
        expect(updatedUser.cart.length).toEqual(1);
        expect(updatedUser.cart[0].id).toEqual('omg123');
        expect(updatedUser.cart[0].item.id).toEqual(item.id);
    });
});