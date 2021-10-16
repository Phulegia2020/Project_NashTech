import React, {Component} from 'react';
import {Button, Icon} from "semantic-ui-react";
// import { Toast, ToastBody, ToastHeader } from 'reactstrap';
// import "./style.css";

class ButtonAddToCart extends Component {
    // constructor(props)
    // {
    //     super(props);
    //     this.state = {
    //         show: false
    //     }
    // }

    onAddToCart = (product) => {
        const shoppingCartItems = JSON.parse(localStorage.getItem('shopping-cart') || '[]');

        const cartItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            url: product.imageurl
        };

        let isExist = false;
        for (let i = 0; i < shoppingCartItems.length; i++) {
            if (shoppingCartItems[i].id === cartItem.id) {
                console.log(shoppingCartItems[i].id);
                console.log(cartItem.id);
                shoppingCartItems[i].quantity++;
                localStorage.setItem('shopping-cart', JSON.stringify(shoppingCartItems));
                return false;
            }
        }

        if (isExist === false) {
            shoppingCartItems.push(cartItem);
            localStorage.setItem('shopping-cart', JSON.stringify(shoppingCartItems));
        }

        // this.setState({
        //     show: true
        // })

        // setTimeout(
        //     () => this.setState({ show: false }), 
        //     2000
        // );
    }

    render() {
        return(
            
            <Button color='green' animated='vertical' onClick={this.onAddToCart.bind(this, this.props.product)} disabled={this.props.product.quantity === 0}>
                <Button.Content hidden>Add to cart</Button.Content>
                <Button.Content visible>
                    <Icon name='shop'/> Shop
                </Button.Content>
                {/* <Toast isOpen={this.state.show} className="toast-message">
                    <ToastHeader>
                    Reactstrap
                    </ToastHeader>
                    <ToastBody>
                    This is a toast on a white background — check it out!
                    </ToastBody>
                </Toast> */}
            </Button>

            
        );
    }
}

export default ButtonAddToCart;