import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlignLeft } from "@fortawesome/free-solid-svg-icons";
import {
  Navbar,
  Button,
  NavbarToggler,
} from "reactstrap";
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
                    <h3 className="m-3">Quản Lý</h3>
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
