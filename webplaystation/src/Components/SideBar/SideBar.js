import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOutAlt,
  faMoneyBill,
  faPeopleArrows,
  faBox,
  faIdCard,
  faFileImport,
  faCity,
  faChartArea,
  faArchive,
  faComment,
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
        statistical: [{id: 'chart', name: 'Chart'}],
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
        get("/auth/logout")
        .then((response) => {
            if (response.status === 200)
            {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('role');
                localStorage.removeItem('user_id');
                localStorage.removeItem('username');
                this.props.history.push("/");
                window.location.reload();
            }
        })
        .catch((error) => {})
    }

    render() {
        return (
            <div className={classNames("sidebar", { "is-open": this.props.isOpen })}>
                <div className="sidebar-header">
                    <span color="info" onClick={this.props.toggle} style={{ color: "#fff" }}>
                        &times;
                    </span>
                    <h3>The Playstation</h3>
                </div>
                <div className="side-menu">
                    <Nav vertical className="list-unstyled pb-3">
                        <SubMenu title="Category" icon={faArchive} items={this.state.categories} url="category"/>
                        
                        <NavItem>
                            <NavLink tag={Link} to={"/admin/product"} className="letter m-2">
                                <FontAwesomeIcon icon={faBox}/>{' '}
                                Product
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} to={"/admin/user"} className="letter m-2">
                                <FontAwesomeIcon icon={faPeopleArrows}/>{' '}
                                User
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} to={"/admin/bill"} className="letter m-2">
                                <FontAwesomeIcon icon={faMoneyBill}/>{' '}
                                Bill
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} to={"/admin/placeorder"} className="letter m-2">
                                <FontAwesomeIcon icon={faIdCard}/>{' '}
                                Place Order
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} to={"/admin/import"} className="letter m-2">
                                <FontAwesomeIcon icon={faFileImport}/>{' '}
                                Import
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} to={"/admin/supplier"} className="letter m-2">
                                <FontAwesomeIcon icon={faCity}/>{' '}
                                Supplier
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} to={"/admin/comment"} className="letter m-2">
                                <FontAwesomeIcon icon={faComment}/>{' '}
                                Bình Luận
                            </NavLink>
                        </NavItem>
                        <SubMenu title="Statistical" icon={faChartArea} items={this.state.statistical} url="statistical"/>
                        <NavItem>
                            <NavLink tag={Link} className="letter m-2" onClick={this.onLogOut}>
                            <FontAwesomeIcon icon={faSignOutAlt}/>{' '}
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
