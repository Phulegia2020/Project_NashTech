import { Dropdown } from 'bootstrap';
import React, {Component} from 'react';
import { Header, Segment, Grid, Modal, Popup, Button, Image, Icon, Label } from 'semantic-ui-react';
import { get, post } from '../../../Utils/httpHelper';
import ShoppingCartDetails from "./ShoppingCartDetails";

class ShoppingCart extends Component {
    constructor (props){
        super(props);

        this.state = {
            open: false,
        }
        this.onCheckOut = this.onCheckOut.bind(this);
    }

    onCheckOut(){
        //console.log(sessionStorage.getItem('user_id'));
        const shoppingCartItems = JSON.parse(localStorage.getItem('shopping-cart') || '[]');
        post('/bills', {total: localStorage.getItem('totalCart'), user_id: sessionStorage.getItem('user_id'), billStatus_id: '3'})
        .then((response) => {
            if (response.status === 200)
            {
                console.log(response.data);
                for (let i = 0; i < shoppingCartItems.length; i++) {
                    console.log(shoppingCartItems[i].id);
                    console.log(shoppingCartItems[i].quantity);
                    post('/billDetails', {bill_id: response.data.id, product_id: shoppingCartItems[i].id, quantity: shoppingCartItems[i].quantity})
                    .then((res) => {
                        if (res.status === 200)
                        {
                            //console.log(res.data);
                        }
                    })
                    .catch(error => console.log(error));
                }
                alert('Thank you for Purchasing!');
            }
        })
        .catch(error => alert('Login to Purchase!'));
        
    }

    render() {
        return (
                <Modal trigger={<Button animated='vertical' inverted style={{marginRight: '0.5em'}}>
                                    {/* <Label circular color="red" empty size="mini" pointing="right" hidden/> */}
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