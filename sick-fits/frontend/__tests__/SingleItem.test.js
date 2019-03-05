import {shallow, mount} from "enzyme";
import toJSON from "enzyme-to-json";
import { MockedProvider } from "react-apollo/test-utils";
import wait from "waait";
import SingleItem, { SINGLE_ITEM_QUERY } from "../components/SingleItem";
import { fakeItem } from "../lib/testUtils";

describe('<SingleItem/>', ()=> {
    it('retrieves and renders loading and data correctly', async ()=>{
        const mocks = [
            {
                request: { query: SINGLE_ITEM_QUERY, variables: {id: "123"}},
                result: { 
                    data: {
                        item: fakeItem()
                    }
                }
            }
        ];

        const itemWrapper = mount(
            <MockedProvider mocks={mocks}>
                <SingleItem id="123"/>
            </MockedProvider>
        );

        expect(itemWrapper.find('p').text()).toContain("Loading...");
        await wait();
        itemWrapper.update();
        expect(itemWrapper.find('h2').text()).toContain("Viewing: dogs are best");
        expect(itemWrapper.find('p').text()).toContain("dogs");
        expect(itemWrapper.find('img').props().src).toContain("dog.jpg");

    });

    it('renders errors when an item cannot be retrieved', async ()=> {
        const mocks = [
            {
                request: { query: SINGLE_ITEM_QUERY, variables: {id: "123"}},
                result: {
                    errors: [{message: "Item could not be found"}]
                }
            }
        ];

        const itemWrapper = mount(
            <MockedProvider mocks={mocks}>
                <SingleItem id="123"/>
            </MockedProvider>
        );
        await wait();
        itemWrapper.update();
        const errorMessage = itemWrapper.find("[data-test='graphql-error']");
        expect(errorMessage.text()).toContain("Item could not be found");
    });
});