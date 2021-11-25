import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {
    Button,
    Menu,
    Container,
    Segment,
    Visibility,
    Dropdown,
    Sticky,
} from 'semantic-ui-react';
import ShoppingCart from "./../ShoppingCart/ShoppingCart";
import {get} from "./../../../Utils/httpHelper";
import Profile from '../Profile/Profile';
import { withRouter } from "react-router";
import "./MainMenu.css";

class MainMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeItem: this.props.activeItem,
            open: false,
            categories: [],
            search: ""
        };
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

    onMenuItemClick = (e, {name}) => {
        this.setState({activeItem: name})
    };

    onLogOut = () => {
        
        get("/auth/logout")
        .then((response) => {
            if (response.status === 200)
            {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('role');
                localStorage.removeItem('user_id');
                localStorage.removeItem('username');
                localStorage.setItem('shopping-cart', []);
                this.setState({isLoggedIn: false});
            }
        })
        .catch((error) => {})
    }

    handleNumberCart(data)
    {
        this.props.handleNumberCart(data);
    }

    componentWillUnmount() {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }

    render() {
        const {activeItem} = this.state;
        return (
            <Sticky>
            <Visibility>
                <Segment
                    inverted
                    textAlign='center'
                    style={{padding: '1em 0em'}}
                    vertical
                >
                    
                    <div className="ps-logo">
                        <img src='https://gmedia.playstation.com/is/image/SIEPDC/ps-store-listing-thumb-01-en-05nov20?$facebook$' alt='logo' width='100px'></img>
                        <h3>The Playstation Store</h3>
                    </div>
                    <Container>
                        <Menu inverted pointing secondary size='large'>
                            <Menu.Item as={Link} to="/WebPlayStation" name='products' active={activeItem === "WebPlayStation"} onClick={this.onMenuItemClick}>Trang Chủ</Menu.Item>
                            <Dropdown text='Thể Loại' pointing className='link item'>
                                <Dropdown.Menu>
                                    <Dropdown.Header>Danh Mục</Dropdown.Header>
                                    {
                                        this.state.categories.map((c) => (
                                        <Dropdown.Item as={Link} to={`/WebPlayStation/category/${c.id}`} key={c.id}>{c.name}</Dropdown.Item>
                                        ))
                                    }
                                </Dropdown.Menu>
                            </Dropdown>
                                                   
                            <Menu.Item as={Link} to="/WebPlayStation/about" name="about" active={activeItem === "WebPlayStation/about"} onClick={this.onMenuItemClick}>Giới Thiệu</Menu.Item>
                            <Menu.Item position='right'>
                                <ShoppingCart numberCart={this.props.numberCart} handleNumberCart={this.props.handleNumberCart}/>
                                {localStorage.getItem('accessToken') !== null ? <Profile onLogOut={this.onLogOut}/>
                                         : <Button as={Link} to="/WebPlayStation/login" active={activeItem === "WebPlayStation/login"} onClick={this.onMenuItemClick} inverted >Đăng Nhập</Button>}
                            </Menu.Item>
                        </Menu>
                    </Container>
                </Segment>
            </Visibility>
            </Sticky>
        );
    }
}

export default withRouter(MainMenu);