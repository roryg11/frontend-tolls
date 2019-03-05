import {shallow, mount} from "enzyme";
import toJSON from "enzyme-to-json";
import { MockedProvider } from "react-apollo/test-utils";
import wait from "waait";
import Router from "next/router";
import Pagination, { PAGINATION_QUERY } from "../components/Pagination";
import { fakeUser, fakeCartItem } from "../lib/testUtils";

Router.router = {
    push(){},
    prefetch(){}
}

function makeMocksFor(length){
    return [{
        request: {query: PAGINATION_QUERY},
        result: { 
            data: { 
                itemsConnection: {
                    __typename: 'aggregate',
                    aggregate: {
                        __typename: 'count',
                        count: length
                    }
                }
            }
        }
    }];
}

describe('<Pagination/>', ()=>{
    it('displays a loading message', ()=>{
        const wrapper = mount(
            <MockedProvider mocks={makeMocksFor(18)}>
                <Pagination page={1}/>
            </MockedProvider>
        );

        expect(wrapper.text()).toContain("Loading...");
    });
    it('loads and renders', async ()=>{
        const wrapper = mount(
            <MockedProvider mocks={makeMocksFor(18)}>
                <Pagination page={1}/>
            </MockedProvider>
        );

        await wait();
        wrapper.update();
        const total = wrapper.find('.totalPages');
        expect(total.text()).toEqual("5");
        const pagination = wrapper.find('div[data-test="pagination"]');
        expect(toJSON(pagination)).toMatchSnapshot();
    });

    it('disables prev link for first page', async ()=>{
        const wrapper = mount(
            <MockedProvider mocks={makeMocksFor(18)}>
                <Pagination page={1}/>
            </MockedProvider>
        );

        await wait();
        wrapper.update();
        expect(wrapper.find('a.prev').prop("aria-disabled")).toEqual(true);
        expect(wrapper.find('a.next').prop("aria-disabled")).toEqual(false);
    });

    it('disables the next link for the last page', async ()=>{
        const wrapper = mount(
            <MockedProvider mocks={makeMocksFor(18)}>
                <Pagination page={5}/>
            </MockedProvider>
        );

        await wait();
        wrapper.update();
        expect(wrapper.find('a.prev').prop("aria-disabled")).toEqual(false);
        expect(wrapper.find('a.next').prop("aria-disabled")).toEqual(true);
    });

    it('enables both buttons on middle pages', async ()=>{
        const wrapper = mount(
            <MockedProvider mocks={makeMocksFor(18)}>
                <Pagination page={3}/>
            </MockedProvider>
        );

        await wait();
        wrapper.update();
        expect(wrapper.find('a.prev').prop("aria-disabled")).toEqual(false);
        expect(wrapper.find('a.next').prop("aria-disabled")).toEqual(false);
    });
})