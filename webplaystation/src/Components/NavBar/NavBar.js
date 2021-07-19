import React, {Component} from 'react';
import "./NavBar.css"
import {
    Link,
  } from "react-router-dom";
  import {
    UncontrolledDropdown,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    NavLink,
    NavItem
  } from 'reactstrap';
import { get } from '../../Utils/httpHelper';
import App from "./../../App";

export default class NavBar extends Component{
    constructor(props)
    {
        super(props);
        this.state = {
            username: "YOUR NAME",
            dropdownOpen: false,
            categories: [],
        };
        this.toggle = this.toggle.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
    }

    componentDidMount(){
        get("/categories")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({categories: response.data});
                console.log(response.data);
            }
        })
        .catch(error => {console.log(error)})
    }
    

    toggle = () => {this.setState({
        dropdownOpen: !this.state.dropdownOpen
    })};

    onMouseEnter() {
        this.setState({dropdownOpen: true});
      }
    
    onMouseLeave() {
    this.setState({dropdownOpen: false});
    }

    

    render(){
        return (
            <div>
                <nav id='navbar'>
                    <ul>
                        <Link to="/category">
                            <li>
                                
                                <Dropdown className="d-inline-block" onMouseOver={this.onMouseEnter} onMouseLeave={this.onMouseLeave} isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                                    <DropdownToggle caret>
                                    Category
                                    </DropdownToggle>
                                    <DropdownMenu>
                                    {
                                        this.state.categories.map((c) => (
                                            <Link to={`/category/${c.id}`} key={c.id}>
                                                <DropdownItem >{c.name}
                                                {/* <NavLink to={`/category/${c.id}`}>
                                                        {c.name}
                                                    </NavLink> */}
                                                {/* <NavItem componentclass={Link} href={`/category/${c.id}`} to={`/category/${c.id}`}>{c.name}</NavItem> */}
                                                </DropdownItem>
                                            </Link>
                                        ))
                                    }
                                    </DropdownMenu>
                                </Dropdown>
                            </li>
                        </Link>
                        <Link to="/product"><li>Product</li></Link>
                        <Link to="/user"><li>User</li></Link>
                    </ul>
    
                    <div className="nav-details">
                    {/* <p className="nav-username"> {this.state.username} </p> */}
                    </div>
                </nav>
            </div>
        );
    }
}