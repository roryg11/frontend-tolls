import React, { Component } from 'react';
import Header from "../components/Header";
import Meta from "../components/Meta";

class Page extends Component {
    render() {
        return (
            <div>
                <Meta/>
                <Header/>
                <p>{this.props.children}</p>
            </div>
        );
    }
}

export default Page;