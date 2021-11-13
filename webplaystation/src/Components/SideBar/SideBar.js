import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOutAlt,
  faMoneyBill,
  faPeopleArrows,
  faBox,
  faFileImport,
  faCity,
  faChartArea,
  faArchive,
  faComment,
  faAddressCard,
  faNewspaper,
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
        statistical: [{id: 'chart', name: 'Báo cáo'}],
        info: [{id: 'info', name: 'Change Password'}],
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
                    <Link to={"/admin"} style={{textDecoration: 'none'}}>
                    <h3>
                        <img src="/images/logoPlayStation.jpg" alt='' width='25px' height='25px' style={{marginRight:'9px'}}></img>
                        The Playstation
                    </h3>
                    </Link>
                </div>
                <div className="side-menu">
                    <Nav vertical className="list-unstyled pb-3">
                        <SubMenu title="Danh Mục" icon={faArchive} items={this.state.categories} url="category"/>
                        
                        <NavItem className="nav-item">
                            <NavLink tag={Link} to={"/admin/product"} className="letter m-2">
                                <FontAwesomeIcon icon={faBox}/>{' '}
                                Máy PS
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} to={"/admin/user"} className="letter m-2">
                                <FontAwesomeIcon icon={faPeopleArrows}/>{' '}
                                Người Dùng
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} to={"/admin/bill"} className="letter m-2">
                                <FontAwesomeIcon icon={faMoneyBill}/>{' '}
                                Hóa Đơn
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} to={"/admin/placeorder"} className="letter m-2">
                                <FontAwesomeIcon icon={faNewspaper}/>{' '}
                                Phiếu Đặt Hàng
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} to={"/admin/import"} className="letter m-2">
                                <FontAwesomeIcon icon={faFileImport}/>{' '}
                                Phiếu Nhập Hàng
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} to={"/admin/supplier"} className="letter m-2">
                                <FontAwesomeIcon icon={faCity}/>{' '}
                                Nhà Cung Cấp
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} to={"/admin/comment"} className="letter m-2">
                                <FontAwesomeIcon icon={faComment}/>{' '}
                                Bình Luận
                            </NavLink>
                        </NavItem>
                        <SubMenu title="Thống Kê" icon={faChartArea} items={this.state.statistical} url="statistical"/>
                        {/* <SubMenu title="Information" icon={faInfo} items={this.state.info} url="info"/> */}
                        <NavItem>
                            <NavLink tag={Link} to={"/admin/info"} className="letter m-2">
                                <FontAwesomeIcon icon={faAddressCard}/>{' '}
                                Thông Tin Cá Nhân
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} className="letter m-2" onClick={this.onLogOut}>
                            <FontAwesomeIcon icon={faSignOutAlt}/>{' '}
                            Đăng Xuất
                            </NavLink>
                        </NavItem>
                    </Nav>
                </div>
            </div>
        )
    }
}

export default withRouter(SideBar);
