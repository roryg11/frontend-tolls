import { mount } from "enzyme";
import toJSON from "enzyme-to-json";
import { MockedProvider } from "react-apollo/test-utils";
import { ApolloConsumer } from "react-apollo";
import wait from "waait";
import SignupForm, { SIGNUP_MUTATION }  from "../components/SignupForm";
import { CURRENT_USER_QUERY } from "../components/User";
import { fakeUser } from "../lib/testUtils";

const me = fakeUser();
const mocks = [
    // signup mock mutation
    {
        request: { 
            query: SIGNUP_MUTATION,
            variables: {
                name: me.name,
                email: me.email,
                password: "rory"
            }
        },
        result: { 
            data: {
                signup: {
                    __typename: 'User',
                    id: 'abc123',
                    name: me.name,
                    email: me.email,
                }
            }
        }
    },
    // mock for current user query
    {
        request: { CURRENT_USER_QUERY },
        result: {
            data: { me }
        }
    }
];

function type(wrapper, name, value){
    wrapper.find(`input[name="${name}"]`).simulate('change', {
        target: { name, value },
    });
}

describe('<SignupForm/>', ()=>{
    it('renders and matches snapshot', ()=>{
        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <SignupForm/>
            </MockedProvider>
        );
        const form = wrapper.find('[data-test="form"]');
        expect(toJSON(form)).toMatchSnapshot();
    });

    it('use calls mutation', async ()=>{
        let apolloClient; 
        // bringing in apollo consumer so that we have access to and can query 
        // the client in this environment to check if the current user query is correct
        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <ApolloConsumer>
                    { (client)=>{
                        apolloClient = client;
                        return <SignupForm/>
                    }} 
                </ApolloConsumer>
            </MockedProvider>
        );

        await wait();
        wrapper.update();

        // simulate the filling of the form
        type(wrapper, "name", me.name);
        type(wrapper, "email", me.email);
        type(wrapper, "password", "rory");

        await wait();
        wrapper.update();
        wrapper.find('form').simulate('submit');

        await wait();
        const user = await apolloClient.query({query: CURRENT_USER_QUERY});

        console.log(user);
    });
});
