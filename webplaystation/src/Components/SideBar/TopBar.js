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
                    <h3 className="m-3">Management</h3>
                    <h3 style={{marginLeft: '1200px'}}><Icon name='user'/>{localStorage.getItem('username')}</h3>
                    <NavbarToggler onClick={this.toggleTopbar} />
                </Navbar>
            </div>
        )
    }
}

export default TopBar;
