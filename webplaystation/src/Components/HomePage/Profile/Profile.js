import React, { Component } from 'react'
import {Link} from 'react-router-dom';
import {
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
                <Dropdown trigger={<span><Icon name='user'/> Xin chào, {localStorage.getItem('username')}</span>} pointing className='link item'>
                    <Dropdown.Menu>
                        <Dropdown.Item as={Link} to={`/WebPlayStation/profile`}>Thông Tin Tài Khoản</Dropdown.Item>
                        <Dropdown.Divider></Dropdown.Divider>
                        <Dropdown.Item as={Link} to={`/WebPlayStation/changpassword`}>Thay Đổi Mật Khẩu</Dropdown.Item>
                        <Dropdown.Divider></Dropdown.Divider>
                        <Dropdown.Item as={Link} to='/WebPlayStation' onClick={this.onSignOut}>Đăng Xuất</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </span>
        );
    }
}
