import React, {Component} from 'react';
import {Button, Icon} from "semantic-ui-react";

class ButtonAddToCart extends Component {
    onAddToCart = (product) => {
        const shoppingCartItems = JSON.parse(localStorage.getItem('shopping-cart') || '[]');

        const cartItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            url: product.url_image
        };

        let isExist = false;
        for (let i = 0; i < shoppingCartItems.length; i++) {
            if (shoppingCartItems[i].id === cartItem.id) {
                // console.log(shoppingCartItems[i].id);
                // console.log(cartItem.id);
                shoppingCartItems[i].quantity++;
                localStorage.setItem('shopping-cart', JSON.stringify(shoppingCartItems));
                return false;
            }
        }

        if (isExist === false) {
            shoppingCartItems.push(cartItem);
            localStorage.setItem('shopping-cart', JSON.stringify(shoppingCartItems));
        }
        if (this.props.notification != null)
        {
            this.props.notification();
        }
        else
        {
            this.props.warning();
        }
    }

    render() {
        return(
            <Button color='green' animated='vertical' onClick={this.onAddToCart.bind(this, this.props.product)} disabled={this.props.product.quantity === 0}>
                <Button.Content hidden>Thêm Vào Giỏ</Button.Content>
                <Button.Content visible>
                    <Icon name='shop'/> Mua
                </Button.Content>
            </Button>
        );
    }
}

export default ButtonAddToCart;