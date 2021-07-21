import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import { DropdownItem } from 'reactstrap';
import {
    Button,
    Menu,
    Container,
    Segment,
    Visibility,
    Dropdown,
    Icon
} from 'semantic-ui-react'
import ShoppingCart from "./../ShoppingCart/ShoppingCart";
import {get} from "./../../../Utils/httpHelper";

class MainMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeItem: this.props.activeItem,
            open: false,
            categories: [],
            isLoggedIn: false
        };
    }

    componentDidMount(){
        get("/categories")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({categories: response.data});
                console.log(response.data);
            }
        })
        .catch(error => {console.log(error)})

        if(localStorage.getItem('accessToken') !== null)
        {
            this.setState({isLoggedIn: true})
        }
        console.log(this.state.isLoggedIn);
    }

    onMenuItemClick = (e, {name}) => {
        this.setState({activeItem: name})
        // console.log(name);
    };

    onLogOut = () => {
        localStorage.setItem('accessToken', '');
        sessionStorage.removeItem('user_id');
        this.setState({isLoggedIn: false});
    }

    // convertToProfile(){
    //     if (this.state.activeItem === 'logined')
    //     {
    //         return(<Button as={Link} to="/WebPlayStation/profile"  onClick={this.onMenuItemClick} inverted>Profile</Button>);
    //     }
    //     else{
    //         return(<Menu.Item>
    //                     <Button as={Link} to="/WebPlayStation/login"  onClick={this.onMenuItemClick} inverted>Log in</Button>
    //                     {/* active={activeItem === "WebPlayStation/login"} */}
    //                     <Button as={Link} to="/WebPlayStation/signup" inverted style={{marginLeft: '0.5em'}}>Sign Up</Button>
    //                 </Menu.Item>);
    //     }
    // }

    render() {
        const {activeItem} = this.state;
        const logined = this.state.isLoggedIn;
        return (
            <Visibility>
                <Segment
                    inverted
                    textAlign='center'
                    style={{padding: '1em 0em'}}
                    vertical
                >
                    <Container>
                        <Menu inverted pointing secondary size='large'>
                            {/* <Menu.Item as={Link} to="/" name="home" active={activeItem === "home"} onClick={this.onMenuItemClick}>Home</Menu.Item> */}
                            <Dropdown text='Category' pointing className='link item'>
                                <Dropdown.Menu>
                                    <Dropdown.Header>Categories</Dropdown.Header>
                                    {
                                        this.state.categories.map((c) => (
                                        <Dropdown.Item as={Link} to={`/WebPlayStation/category/${c.id}`} key={c.id}>{c.name}</Dropdown.Item>
                                        ))
                                    }
                                    {/* <Dropdown.Item>Home Goods</Dropdown.Item>
                                    <Dropdown.Item>Bedroom</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Header>Order</Dropdown.Header>
                                    <Dropdown.Item>Status</Dropdown.Item>
                                    <Dropdown.Item>Cancellations</Dropdown.Item> */}
                                </Dropdown.Menu>
                            </Dropdown>
                            <Menu.Item as={Link} to="/WebPlayStation" name='products' active={activeItem === "WebPlayStation"} onClick={this.onMenuItemClick}>Products</Menu.Item>                        
                            <Menu.Item as={Link} to="/WebPlayStation/about" name="about" active={activeItem === "WebPlayStation/about"} onClick={this.onMenuItemClick}>About</Menu.Item>
                            <Menu.Item position='right'>
                                {logined ? <Button as={Link} to="/WebPlayStation/login" inverted style={{marginLeft: '0.5em'}} onClick={this.onLogOut}>Log Out</Button>
                                         : <Button as={Link} to="/WebPlayStation/login" active={activeItem === "WebPlayStation/login"} onClick={this.onMenuItemClick} inverted >Log in</Button>}
                                {/* <Button as={Link} to="/WebPlayStation/login" active={activeItem === "WebPlayStation/login"} onClick={this.onMenuItemClick} inverted >Log in</Button>
                                <Button as={Link} to="/WebPlayStation/signup" inverted style={{marginLeft: '0.5em'}} disabled={localStorage.getItem("accessToken") !== ""}>Sign Up</Button>
                                <Button as={Link} to="/WebPlayStation/login" inverted style={{marginLeft: '0.5em'}} onClick={this.onLogOut}>Log Out</Button> */}
                                <ShoppingCart/>
                            </Menu.Item>
                        </Menu>
                    </Container>
                </Segment>
            </Visibility>
        );
    }
}

export default MainMenu;