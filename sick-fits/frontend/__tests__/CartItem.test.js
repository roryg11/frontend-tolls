import { shallow, mount } from "enzyme";
import toJSON from "enzyme-to-json";
import CartItem from "../components/CartItem";

const fakeCartItem = {
    id: "ABC123",
    quantity: 4,
    item: {
        id: "ABF234",
        price: 30505,
        title: "Cutest Planter",
        image: "imAPlant.jpg"
    }

}

describe('<CartItem/>', ()=>{
    it('renders', ()=>{
        shallow(<CartItem cartItem={fakeCartItem}/>);
    });
    it('matches the snapshot', ()=>{
        const cartItemWrapper = shallow(<CartItem cartItem={fakeCartItem}/>);
        expect(cartItemWrapper).toMatchSnapshot(); 
    });
    it('renders the image correctly', ()=>{
        const cartItemWrapper = shallow(<CartItem cartItem={fakeCartItem}/>);
        const img = cartItemWrapper.find('img');
        expect(img.props().src).toEqual(fakeCartItem.item.image);
    });
    it('renders the pricing and quantity and subtotal correctly', ()=>{
        const cartItemWrapper = shallow(<CartItem cartItem={fakeCartItem}/>);
        const pricing = cartItemWrapper.find('p');
        const price = fakeCartItem.item.price * fakeCartItem.quantity;
        expect(pricing.text()).toEqual('$1,220.20 - 4 × $305.05 each');
    });
});