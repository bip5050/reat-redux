import React, { Component } from 'react';
import HeaderContainer from '../../../containers/Header';


class Header extends Component{
    constructor(props) {
        super(props);
    }
    render() {
        return ( 
            <HeaderContainer userData={this.props.user} currentPage={this.props.currentPage}/>
        )
    }
}
export default Header;