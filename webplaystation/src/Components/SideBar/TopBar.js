import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlignLeft } from "@fortawesome/free-solid-svg-icons";
import {
  Navbar,
  Button,
  NavbarToggler,
  Collapse,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";

import React, { Component } from 'react'

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
                    <NavbarToggler onClick={this.toggleTopbar} />
                </Navbar>
            </div>
        )
    }
}

export default TopBar;
