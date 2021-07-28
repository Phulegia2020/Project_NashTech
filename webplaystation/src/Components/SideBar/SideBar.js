import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faBriefcase,
  faPaperPlane,
  faQuestion,
  faImage,
  faCopy,
  faUser,
  faSignOutAlt,
  faMoneyBill,
} from "@fortawesome/free-solid-svg-icons";
import { NavItem, NavLink, Nav } from "reactstrap";
import classNames from "classnames";
import { Link } from "react-router-dom";
import SubMenu from "./SubMenu";
import React, { Component } from 'react';
import {get} from '../../Utils/httpHelper';
import { withRouter } from "react-router";

class SideBar extends Component {
    state = {
        categories: [],
        isDisplayForm: false,
        redirect: false
    }

    componentDidMount(){
        get("/categories")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({categories: response.data});
            }
        })
        .catch(error => {console.log(error)})
    }

    onLogOut = () => {
        localStorage.setItem('accessToken', '');
        sessionStorage.removeItem('user_id');
        sessionStorage.removeItem('username');
        //this.props.onAdminOut();
        this.props.history.push("/");
        window.location.reload();
    }

    render() {
        return (
            <div className={classNames("sidebar", { "is-open": this.props.isOpen })}>
                <div className="sidebar-header">
                    <span color="info" onClick={this.props.toggle} style={{ color: "#fff" }}>
                        &times;
                    </span>
                    <h3>DashBoard</h3>
                </div>
                <div className="side-menu">
                    <Nav vertical className="list-unstyled pb-3">
                        <SubMenu title="Category" icon={faHome} items={this.state.categories} />
                        
                        <NavItem>
                        <NavLink tag={Link} to={"/admin/product"} className="letter">
                            <FontAwesomeIcon icon={faBriefcase} className="mr-2" />
                            Product
                        </NavLink>
                        </NavItem>
                        <NavItem>
                        <NavLink tag={Link} to={"/admin/user"} className="letter">
                            <FontAwesomeIcon icon={faCopy} className="mr-2" />
                            User
                        </NavLink>
                        </NavItem>
                        <NavItem>
                        <NavLink tag={Link} to={"/admin/bill"} className="letter">
                            <FontAwesomeIcon icon={faMoneyBill} className="mr-2" />
                            Bill
                        </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} className="letter" onClick={this.onLogOut}>
                            <FontAwesomeIcon className="mr-3" icon={faSignOutAlt}/>
                            Log Out
                            </NavLink>
                        </NavItem>
                    </Nav>
                </div>
            </div>
        )
    }
}

export default withRouter(SideBar);
