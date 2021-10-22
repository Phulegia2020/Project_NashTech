import React, {Component} from 'react';
import { Header, Grid, Modal, Button, Icon } from 'semantic-ui-react';
import { get } from '../../../Utils/httpHelper';
import ShoppingCartDetails from "./ShoppingCartDetails";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class ShoppingCart extends Component {
    constructor (props){
        super(props);

        this.state = {
            open: true,
            bill: {},
            billDetails: [],
            user: {},
            // shoppingCartItems: []
        }
        this.onCheckOut = this.onCheckOut.bind(this);
    }

    componentDidMount(){
        // this.setState({
        //     shoppingCartItems: JSON.parse(localStorage.getItem('shopping-cart') || '[]')
        // })
        if (localStorage.getItem('user_id') !== null)
        {
            get(`/users/${localStorage.getItem('user_id')}`)
            .then((response) => {
                if (response.status === 200)
                {
                    this.setState({
                        user: response.data
                    })
                }
            })
        }
    }

    // componentDidUpdate(prevProps, prevState)
    // {
    //     if (prevState.shoppingCartItems.length !== this.state.shoppingCartItems.length)
    //     {
    //         this.setState({
    //             shoppingCartItems: JSON.parse(localStorage.getItem('shopping-cart') || '[]')
    //         })
    //     }
    // }

    onCheckOut(){
        const shoppingCartItems = JSON.parse(localStorage.getItem('shopping-cart') || '[]');
        if (shoppingCartItems.length == 0)
        {
            // alert('Cart is empty. Can not check out!');
            //this.props.notificationCart('Giỏ hàng trống!');
            toast.warning('Giỏ hàng trống!');
            return;
        }
        if (localStorage.getItem('user_id') === null)
        {
            // alert('Please, Login to Purchase');
            //this.props.notificationCart('Hãy đăng nhập tài khoản để thanh toán giỏ hàng!');
            toast.error('Hãy đăng nhập tài khoản để thanh toán giỏ hàng!');
            return;
        }
        window.location.href='/WebPlayStation/order';
    }

    componentWillUnmount() {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }

    render() {
        // const shoppingCartItems = JSON.parse(localStorage.getItem('shopping-cart') || '[]');
        return (
            <div>
                <Modal trigger={<Button animated='vertical' inverted style={{marginRight: '0.5em'}} className="shopping-cart">
                    {/* <i
					class="fas fa-shopping-cart fa-x text-white"></i><span
                    class="cart-number">0</span> */}
                                    <Button.Content visible>Giỏ Hàng</Button.Content>
                                    <Button.Content hidden>
                                        <Icon name='shop' />
                                        
                                    </Button.Content>
                                </Button>} >
                    <Modal.Header>Giỏ Hàng</Modal.Header>
                    <Modal.Content image>
                        <Modal.Description>
                            <Header>Chi Tiết</Header>
                            <Grid.Row>
                                <Grid.Column>
                                    <ShoppingCartDetails />
                                </Grid.Column>
                            </Grid.Row>
                        </Modal.Description>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button positive icon='checkmark' labelPosition='right' content="Thanh Toán" onClick={this.onCheckOut}/>
                    </Modal.Actions>
                </Modal>
                {/* <ToastContainer position="bottom-center"
                        autoClose={2000}
                        hideProgressBar
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover/> */}
            </div>
        );
    }
}
export default ShoppingCart;