import {shallow, mount} from "enzyme";
import toJSON from "enzyme-to-json";
import { MockedProvider } from "react-apollo/test-utils";
import wait from "waait";
import PleaseSignIn from "../components/PleaseSignIn";
import { CURRENT_USER_QUERY } from "../components/user";
import { fakeUser } from "../lib/testUtils";

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

const Hey = () => <p>Hey! See me when you sign in.</p>;

describe('<PleaseSignIn/>', ()=>{
    it('shows a login component when the user is not signed in', async ()=>{
        const signinWrapper = mount(
            <MockedProvider mocks={notSignedIn}>
                <PleaseSignIn>
                    <Hey/>
                </PleaseSignIn>
            </MockedProvider>
        );

        await wait();
        signinWrapper.update();
        expect(signinWrapper.text()).toContain("Please sign in before continuing");
        expect(signinWrapper.find('Hey').exists()).toBe(false);
    });

    it('shows the contained element when a user is signed in', async ()=>{
        const signinWrapper = mount(
            <MockedProvider mocks={signedInMock}>
                <PleaseSignIn>
                    <Hey/>
                </PleaseSignIn>
            </MockedProvider>
        );

        await wait();
        signinWrapper.update();
        console.log(signinWrapper.debug());
        
        expect(signinWrapper.text().includes("Please sign in before continuing")).toBe(false);
        expect(signinWrapper.contains(<Hey/>)).toBe(true);
    });
});