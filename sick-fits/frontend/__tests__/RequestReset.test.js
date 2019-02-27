import {shallow, mount} from "enzyme";
import toJSON from "enzyme-to-json";
import { MockedProvider } from "react-apollo/test-utils";
import wait from "waait";
import RequestReset, { REQUEST_RESET_MUTATION }  from "../components/RequestReset";
import { fakeUser } from "../lib/testUtils";

const mocks = [
    {
        request: {
            query: REQUEST_RESET_MUTATION,
            variables: {
                email: "rory@gmail.com"
            }
        },
        result: { 
            data: {
                requestReset: { message: "success", __typename: 'Message'}
            }
        }
        
    }
];

describe('<RequestReset/>', ()=>{
    it('renders and matches snapshot', async ()=>{
        const wrapper = mount(
            <MockedProvider>
                <RequestReset/>
            </MockedProvider>
        );

        await wait();
        wrapper.update();

        const form = wrapper.find('form');
        expect(toJSON(form)).toMatchSnapshot();
    });

    it('calls the reset mutation', async ()=>{
        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <RequestReset/>
            </MockedProvider>
        );

        await wait();
        wrapper.update();

        wrapper.find('input').simulate('change', { target: { name: "email", value: "rory@gmail.com"}});
        wrapper.find('form').simulate('submit');
        await wait();
        wrapper.update();

        const message = wrapper.find('p');
        expect(message.text()).toContain("Check your email for a reset password link!");
    });
});