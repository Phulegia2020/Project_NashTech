import React, {Component} from 'react';
import "./NavBar.css"
import {
    Link,
  } from "react-router-dom";

export default class NavBar extends Component{
    state = {
        username: "YOUR NAME"
    };

    render(){
        return (
            <div>
                <nav id='navbar'>
                    <ul>
                    <Link to="/category"><li>Category</li></Link>
                    <Link to="/product"><li>Product</li></Link>
                    <Link to="/user"><li>User</li></Link>
                    </ul>
    
                    <div className="nav-details">
                    <p className="nav-username"> {this.state.username} </p>
                    </div>
                </nav>
            </div>
        );
    }
}