import React, {Component} from 'react';
import {Table, Button, Header, Image} from 'semantic-ui-react';
import { get } from '../../../Utils/httpHelper';
import {formatCurrency} from "../../../Utils/Utils";
import "./Order.css";

class ShoppingCartDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ShoppingCartItems: [],
            products: []
        };
    }

    componentDidMount() {
        this.state.ShoppingCartItems = JSON.parse(localStorage.getItem('shopping-cart') || '[]');
        this.setState(this.state);
        for (var i = 0; i < this.state.ShoppingCartItems.length; i++)
        {
            get(`/products/${this.state.ShoppingCartItems[i].id}`)
            .then((response) => {
                if (response.status === 200)
                {
                    this.state.products.push(response.data);
                    //console.log(response.data);
                }
            })
            .catch((error) => console.log(error))
        }
    }

    onRemoveCart(item) {
        var items = this.state.ShoppingCartItems;
        for (var i = 0; i < items.length; i++) {
            if (items[i].id === item.id) {
                items.splice(i, 1);
                this.setState({ShoppingCartItems: items});
                localStorage.setItem('shopping-cart', JSON.stringify(this.state.ShoppingCartItems));
                this.props.handleNumberCart(this.state.ShoppingCartItems.length);
                return false;
            }
        }
        // this.props.handleNumberCart(this.state.ShoppingCartItems.length);
    }

    onIncreaseQuantity(item) {
        var items = this.state.ShoppingCartItems;
        for (var i = 0; i < items.length; i++) {
            if (items[i].id === item.id) {
                for (var j = 0; j < this.state.products.length; j++)
                {
                    //console.log(this.state.products[j]);
                    if (this.state.products[j].id === item.id && this.state.products[j].quantity === item.quantity)
                    {
                        return;
                    }
                }
                items[i].quantity++;
                this.setState({ShoppingCartItems: items});
                localStorage.setItem('shopping-cart', JSON.stringify(this.state.ShoppingCartItems));
                return false;
            }
        }
    }

    onDecreaseQuantity(item) {
        if (item.quantity === 1) return;
        var items = this.state.ShoppingCartItems;
        for (var i = 0; i < items.length; i++) {
            if (items[i].id === item.id) {
                items[i].quantity--;
                this.setState({ShoppingCartItems: items});
                localStorage.setItem('shopping-cart', JSON.stringify(this.state.ShoppingCartItems));
                return false;
            }
        }
    }


    // TOTAL
    getTotal() {
        var total = Object.keys(this.state.ShoppingCartItems).reduce((previous, key) => {
            return previous + this.state.ShoppingCartItems[key].price * this.state.ShoppingCartItems[key].quantity;
        }, 0);
        return formatCurrency(total);
    }

    render() {
        return (
            <div>
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>STT</Table.HeaderCell>
                            <Table.HeaderCell>Sản Phẩm</Table.HeaderCell>
                            <Table.HeaderCell>Tên Máy</Table.HeaderCell>
                            <Table.HeaderCell>Giá</Table.HeaderCell>
                            <Table.HeaderCell>Số Lượng</Table.HeaderCell>
                            <Table.HeaderCell>Tổng Giá</Table.HeaderCell>
                            <Table.HeaderCell>
                                Xóa
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {
                            this.state.ShoppingCartItems.map((item, index) =>
                                <Table.Row key={item.id}>
                                    <Table.Cell textAlign="right">{index + 1}</Table.Cell>
                                    <Table.Cell textAlign="right">
                                        {/* <Image style={{height: '75px'}} src={`data:image/jpeg;base64,${item.url}`}/> */}
                                        <Image style={{height: '75px'}} src={item.url}/>
                                    </Table.Cell>
                                    <Table.Cell textAlign="left">{item.name}</Table.Cell>
                                    <Table.Cell textAlign="right">{formatCurrency(item.price)}</Table.Cell>
                                    <Table.Cell textAlign="right">
                                        <Button onClick={this.onDecreaseQuantity.bind(this, item)} className="btn btn-xs btn-warning">-</Button>
                                        &nbsp;{item.quantity}&nbsp;
                                        <Button onClick={this.onIncreaseQuantity.bind(this, item)} className="btn btn-xs btn-warning">+</Button>
                                    </Table.Cell>
                                    <Table.Cell textAlign="right">{formatCurrency(item.price * item.quantity)}</Table.Cell>
                                    <Table.Cell textAlign="right">
                                        <Button onClick={this.onRemoveCart.bind(this, item)} className="btn btn-xs btn-danger" color="red">X</Button>
                                    </Table.Cell>
                                </Table.Row>
                            )
                        }
                        
                    </Table.Body>
                </Table>
                <Header>Tổng Cộng: {this.getTotal()}</Header>
            </div>
        );
    }
}

export default ShoppingCartDetails;
