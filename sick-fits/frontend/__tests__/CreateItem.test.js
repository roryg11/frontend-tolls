import { mount } from "enzyme";
import toJSON from "enzyme-to-json";
import { MockedProvider } from "react-apollo/test-utils";
import wait from "waait";
import Router from "next/router";
import CreateItem, { CREATE_ITEM_MUTATION }  from "../components/CreateItem";
import { fakeItem } from "../lib/testUtils";

const dogImage = "https://dog.dog.com"

// mocking global fetch API since this is a browser thing
// need to mimick this in the node env
global.fetch = jest.fn().mockResolvedValue({
    json: () => ({
        secure_url: dogImage,
        eager: [ {secure_url: dogImage}]
    })
}); 

describe('<CreateItem/>', ()=>{
    it('renders and matches snapshot', ()=>{
        const formWrapper = mount(
            <MockedProvider>
                <CreateItem/>
            </MockedProvider>
        );

        const form = formWrapper.find('[data-test="form"]');
        expect(toJSON(form)).toMatchSnapshot();
    });
    it('uploads a file when changed', async ()=> {
        const formWrapper = mount(
            <MockedProvider>
                <CreateItem/>
            </MockedProvider>
        );

        // do this to ensure that you get past the loading state
        await wait();
        formWrapper.update();
        const input = formWrapper.find('input[type="file"]');
        input.simulate('change', { target: { files: ['dog.jpg']}});
        await wait();
        formWrapper.update();
        const component = formWrapper.find('CreateItem').instance();
        expect(component.state.image).toEqual(dogImage);
        expect(component.state.largeImage).toEqual(dogImage);
        expect(global.fetch).toHaveBeenCalled();
        global.fetch.mockReset();
    });
    it('updates state when its changed', async ()=>{
        const formWrapper = mount(
            <MockedProvider>
                <CreateItem/>
            </MockedProvider>
        );

        const newItem = {
            title: "dog",
            price: 500000,
            description: "cutieeeee"
        }

        await wait();
        formWrapper.update();
        const title = formWrapper.find("#title");
        const price = formWrapper.find("#price");
        const description = formWrapper.find("#description");

        title.simulate('change', { target: { value: newItem.title, name:"title"}});
        price.simulate('change', {target: {value: newItem.price, name: "price"}}); 
        description.simulate('change', {target: {value: newItem.description, name: "description"}});
        expect(formWrapper.find('CreateItem').instance().state).toMatchObject(newItem);
    });

    it('sends a mutation when the valid item is submitted', async ()=>{
        const newItem = fakeItem();
        const mock = [{
            request: {
                query: CREATE_ITEM_MUTATION, 
                variables: {
                    title: newItem.title,
                    price: newItem.price,
                    image: "",
                    largeImage: "",
                    description: newItem.description
                }
            },
            result: {
                data: {
                    createItem: {
                        ...fakeItem,
                        id: 'abc123',
                        __typename: "Item"
                    }
                }
            }
        }];

        const formWrapper = mount(
            <MockedProvider mocks={mock}>
                <CreateItem/>
            </MockedProvider>
        );

        await wait();
        formWrapper.update()

        const title = formWrapper.find("#title");
        const price = formWrapper.find("#price");
        const description = formWrapper.find("#description");

        title.simulate('change', { target: { value: newItem.title, name:"title"}});
        price.simulate('change', {target: {value: newItem.price, name: "price"}}); 
        description.simulate('change', {target: {value: newItem.description, name: "description"}});

        // mocking router
        Router.router = {
            push: jest.fn()
        };

        formWrapper.find('form').simulate('submit');
        await wait();

        // testing that it goes to the right place on success
        expect(Router.router.push).toHaveBeenCalled();
        expect(Router.router.push).toHaveBeenCalledWith({pathname: "/item", query: {id: 'abc123'}});
    });
});