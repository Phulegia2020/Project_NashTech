import React, {Component} from 'react';
import { Header, Grid, Modal, Button, Icon } from 'semantic-ui-react';
import { get } from '../../../Utils/httpHelper';
import ShoppingCartDetails from "./ShoppingCartDetails";

class ShoppingCart extends Component {
    constructor (props){
        super(props);

        this.state = {
            open: true,
            bill: {},
            billDetails: [],
            user: {}
        }
        this.onCheckOut = this.onCheckOut.bind(this);
    }

    componentDidMount(){
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

    onCheckOut(){
        const shoppingCartItems = JSON.parse(localStorage.getItem('shopping-cart') || '[]');
        if (localStorage.getItem('user_id') === null)
        {
            alert('Please, Login to Purchase');
            return;
        }
        if (shoppingCartItems.length == 0)
        {
            alert('Cart is empty. Can not check out!');
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
        return (
                <Modal trigger={<Button animated='vertical' inverted style={{marginRight: '0.5em'}}>
                                    <Button.Content visible>Cart</Button.Content>
                                    <Button.Content hidden>
                                        <Icon name='shop' />
                                        
                                    </Button.Content>
                                </Button>} >
                    <Modal.Header>Shopping Cart</Modal.Header>
                    <Modal.Content image>
                        <Modal.Description>
                            <Header>Cart Items</Header>
                            <Grid.Row>
                                <Grid.Column>
                                    <ShoppingCartDetails />
                                </Grid.Column>
                            </Grid.Row>
                        </Modal.Description>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button positive icon='checkmark' labelPosition='right' content="Checkout" onClick={this.onCheckOut}/>
                    </Modal.Actions>
                </Modal>
        );
    }
}
export default ShoppingCart;