import Item from "../components/Item";
import { shallow, enzyme } from "enzyme";
import toJSON from "enzyme-to-json";

const fakeItem = {
    id: "HELLO3451",
    title: "Sweet Kicks",
    price: "45059",
    image: "kicks.jpg",
    largeImage: "bigKicks.jpg"
};

describe('<Item/>', ()=>{
    it('renders', ()=>{
        shallow(<Item item={fakeItem}/>);
    });

    it('matches the snapshot', ()=>{
        const itemWrapper = shallow(<Item item={fakeItem}/>);
        expect(toJSON(itemWrapper)).toMatchSnapshot();
    });

    it('renders the image properly', ()=>{
        const itemWrapper = shallow(<Item item={fakeItem}/>);
        const img = itemWrapper.find('img');
        expect(img.props().src).toEqual(fakeItem.image);
        expect(img.props().alt).toEqual(fakeItem.title);
    });

    it('renders the price and title properly', ()=>{
        const itemWrapper = shallow(<Item item={fakeItem}/>);
        const PriceTag = itemWrapper.find('PriceTag');
        const title = itemWrapper.find('Title a');
        expect(title.children().text()).toEqual(fakeItem.title);
        expect(PriceTag.children().text()).toBe("$450.59");
    });

    it('renders out the buttons for the item', ()=>{
        const itemWrapper = shallow(<Item item={fakeItem}/>);
        const buttonList = itemWrapper.find('.buttonList');
        expect(buttonList.children()).toHaveLength(3);
        expect(buttonList.find('Link')).toHaveLength(1);
        expect(buttonList.find('AddToCart')).toHaveLength(1);
        expect(buttonList.find('DeleteItem')).toHaveLength(1);
    });
});