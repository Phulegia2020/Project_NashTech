import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlignLeft } from "@fortawesome/free-solid-svg-icons";
import {
  Navbar,
  Button,
  NavbarToggler,
} from "reactstrap";
import {
    Icon
} from 'semantic-ui-react'

import React, { Component } from 'react';
import "./Footer.css";

class TopBar extends Component {
    state = {
        topbarIsOpen: true
    }

    toggleTopbar = () => {
        this.setState({
            topbarIsOpen: !this.state.topbarIsOpen
        })
    };

    render() {
        return (
            <div>
                <Navbar
                    color="light"
                    light
                    className="navbar shadow-sm p-3 mb-5 bg-white rounded"
                    expand="md"
                    >
                    <Button color="info" onClick={this.props.toggleSidebar}>
                        <FontAwesomeIcon icon={faAlignLeft} />
                    </Button>
                    <h3 className="m-3">Management</h3>
                    {/* <h3 style={{marginLeft: '1200px'}}><Icon name='user'/>{localStorage.getItem('username')}</h3> */}
                    {/* <div class="profile_details_left">
                        <ul class="nofitications-dropdown">
                            <li class="dropdown head-dpdn"><a href="#"
                                class="dropdown-toggle" data-toggle="dropdown"
                                aria-expanded="false"><i class="fa fa-envelope"></i><span
                                    class="badge">3</span></a>
                                <ul class="dropdown-menu">
                                    <li>
                                        <div class="notification_header">
                                            <h3>You have 3 new messages</h3>
                                        </div>
                                    </li>
                                    <li><a href="#">
                                            <div class="user_img">
                                                <img src="images/p4.png" alt=""/>
                                            </div>
                                            <div class="notification_desc">
                                                <p>New Message</p>
                                                <p>
                                                    <span>1 hour ago</span>
                                                </p>
                                            </div>
                                            <div class="clearfix"></div>
                                    </a></li>
                                    <li class="odd"><a href="#">
                                            <div class="user_img">
                                                <img src="images/p2.png" alt=""/>
                                            </div>
                                            <div class="notification_desc">
                                                <p>New Message(1)</p>
                                                <p>
                                                    <span>2 hours ago</span>
                                                </p>
                                            </div>
                                            <div class="clearfix"></div>
                                    </a></li>
                                    <li><a href="#">
                                            <div class="user_img">
                                                <img src="images/p3.png" alt=""/>
                                            </div>
                                            <div class="notification_desc">
                                                <p>New Message(2)</p>
                                                <p>
                                                    <span>3 hours ago</span>
                                                </p>
                                            </div>
                                            <div class="clearfix"></div>
                                    </a></li>
                                    <li>
                                        <div class="notification_bottom">
                                            <a href="${pageContext.servletContext.contextPath }/#">See all messages</a>
                                        </div>
                                    </li>
                                </ul></li>
                            <li class="dropdown head-dpdn"><a href="#"
                                class="dropdown-toggle" data-toggle="dropdown"
                                aria-expanded="false"><i class="fa fa-bell"></i><span
                                    class="badge blue">3</span></a>
                                <ul class="dropdown-menu">
                                    <li>
                                        <div class="notification_header">
                                            <h3>You have 3 new notification</h3>
                                        </div>
                                    </li>
                                    <li><a href="#">
                                            <div class="user_img">
                                                <img src="images/p5.png" alt=""/>
                                            </div>
                                            <div class="notification_desc">
                                                <p>New Notification</p>
                                                <p>
                                                    <span>1 hour ago</span>
                                                </p>
                                            </div>
                                            <div class="clearfix"></div>
                                    </a></li>
                                    <li class="odd"><a href="#">
                                            <div class="user_img">
                                                <img src="images/p6.png" alt=""/>
                                            </div>
                                            <div class="notification_desc">
                                                <p>New Notification(1)</p>
                                                <p>
                                                    <span>2 hours ago</span>
                                                </p>
                                            </div>
                                            <div class="clearfix"></div>
                                    </a></li>
                                    <li><a href="#">
                                            <div class="user_img">
                                                <img src="images/p7.png" alt=""/>
                                            </div>
                                            <div class="notification_desc">
                                                <p>New Notification(2)</p>
                                                <p>
                                                    <span>3 hours ago</span>
                                                </p>
                                            </div>
                                            <div class="clearfix"></div>
                                    </a></li>
                                    <li>
                                        <div class="notification_bottom">
                                            <a href="#">See all notifications</a>
                                        </div>
                                    </li>
                                </ul></li>
                        </ul>
                        <div class="clearfix"></div>
                    </div> */}
                    <div className="user-topbar">
                        <img src="/images/p7.png" alt=""></img>
                    </div>
                    <h3>{localStorage.getItem('username')}</h3>
                    <NavbarToggler onClick={this.toggleTopbar} />
                </Navbar>
            </div>
        )
    }
}

export default TopBar;
