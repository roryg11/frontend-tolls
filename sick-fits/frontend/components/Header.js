import Nav from "./Nav";

const Header = () => (
    <div>
        <div className="bar">
            <a href="">Sick Fits</a>
        </div>
        <div className="sub-bar">
            <p>Search</p>
        </div>
        <Nav/>
        <div>Cart</div>
    </div>   
)

export default Header;