import { shallow, mount } from "enzyme";
import toJSON from "enzyme-to-json";
import CartCount from "../components/CartCount";

describe('<CartCount/>', ()=>{
    it('renders and matches snapshot', ()=>{
        const cartCountWrapper = shallow(<CartCount count={11}/>);
        expect(toJSON(cartCountWrapper)).toMatchSnapshot();
    });

    it('updates via props', ()=>{
        const cartCountWrapper = shallow(<CartCount count={15}/>);
        expect(toJSON(cartCountWrapper)).toMatchSnapshot();
        cartCountWrapper.setProps({count: 16});
        expect(toJSON(cartCountWrapper)).toMatchSnapshot();
    });
});