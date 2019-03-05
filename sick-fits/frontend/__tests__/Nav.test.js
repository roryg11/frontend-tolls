import {shallow, mount} from "enzyme";
import toJSON from "enzyme-to-json";
import { MockedProvider } from "react-apollo/test-utils";
import wait from "waait";
import Nav from "../components/Nav";
import { CURRENT_USER_QUERY } from "../components/user";
import { fakeUser, fakeCartItem } from "../lib/testUtils";

const notSignedIn = [
    {
        request: { query: CURRENT_USER_QUERY },
        result: { data: {me: null}}
    }
];

const signedInMock = [
    {
        request: {query: CURRENT_USER_QUERY },
        result: { data: {me: fakeUser()}}
    }
];

const signedInWithItems = [
    {
        request: {query: CURRENT_USER_QUERY},
        result: { data: { me: {
                ...fakeUser(),
                cart: [fakeCartItem(), fakeCartItem(), fakeCartItem()]
            }
        }
    }
    }
]

describe('Nav', ()=>{
    it('shows a simple nav when a user is not signed in', async ()=>{
        const wrapper = mount(
            <MockedProvider mocks={notSignedIn}>
                <Nav/>
            </MockedProvider>
        );
        
        await wait();
        wrapper.update();
        const links = wrapper.find('Link');
        const nav = wrapper.find('Nav');
        expect(links.length).toEqual(3);
        expect(toJSON(nav)).toMatchSnapshot();
;    });
    it('shows the full nav when a user is logged in', async ()=>{
        const wrapper = mount(
            <MockedProvider mocks={signedInMock}>
                <Nav/>
            </MockedProvider>
        );

        await wait();
        wrapper.update();
        const links = wrapper.find('Link');
        expect(links.length).toEqual(5);
        expect(wrapper.text()).toContain("Shop");
        expect(wrapper.text()).toContain("Sell");
        expect(wrapper.text()).toContain("Orders");
        expect(wrapper.text()).toContain("Account");
        expect(wrapper.find('Signout').exists()).toBe(true);
    });
    it('shows the cart count when the user has items in their cart', async ()=>{
        const wrapper = mount(
            <MockedProvider mocks={signedInWithItems}>
                <Nav/>
            </MockedProvider>
        );

        await wait();
        wrapper.update();
        const count = wrapper.find('.count');
        expect(toJSON(count)).toMatchSnapshot();
    });
});