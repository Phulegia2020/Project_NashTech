import React, { Component } from 'react'
import {Link} from 'react-router-dom';
import {
    Button,
    Menu,
    Container,
    Segment,
    Visibility,
    Dropdown,
    Icon
} from 'semantic-ui-react'

export default class Profile extends Component {
    onSignOut = () => {
        this.props.onLogOut();
    }

    render() {
        return (
            <span>
                <Dropdown trigger={<span><Icon name='user'/> Hello, {sessionStorage.getItem('username')}</span>} pointing className='link item'>
                    <Dropdown.Menu>
                        <Dropdown.Item as={Link} to={`/WebPlayStation/profile`}>Change Password</Dropdown.Item>
                        <Dropdown.Divider></Dropdown.Divider>
                        <Dropdown.Item as={Link} to='/WebPlayStation' onClick={this.onSignOut}>Log Out</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </span>
        );
    }
}
