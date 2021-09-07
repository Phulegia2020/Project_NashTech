import React, { Component } from 'react';
import {Table, Button, Header, Image} from 'semantic-ui-react';
import {formatCurrency, formatQuantity} from "../../../Utils/Utils";
import "./Order.css";
import Footer from "../Footer/Footer";
import { get, post } from '../../../Utils/httpHelper';

export default class Order extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ShoppingCartItems: [],
            bill: {},
            billDetails: [],
            user: {}
        };
        this.onCheckOut = this.onCheckOut.bind(this);
    }

    componentDidMount() {
        this.state.ShoppingCartItems = JSON.parse(localStorage.getItem('shopping-cart') || '[]');
        this.setState(this.state);

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

    getTotal() {
        var total = Object.keys(this.state.ShoppingCartItems).reduce((previous, key) => {
            return previous + this.state.ShoppingCartItems[key].price * this.state.ShoppingCartItems[key].quantity;
        }, 0);
        return formatCurrency(total);
    }

    async onCheckOut(){
        const shoppingCartItems = JSON.parse(localStorage.getItem('shopping-cart') || '[]');
        if (shoppingCartItems.length == 0)
        {
            alert('The Order is empty. Can not Confirm!');
            return;
        }
        await post('/bills', {total: 0, user_id: localStorage.getItem('user_id'), billStatus_id: '3'})
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    bill: response.data
                })
            }
        })
        .catch(error => alert('Login to Purchase!'));

        for (let i = 0; i < shoppingCartItems.length; i++) {
            await post('/billDetails', {bill_id: this.state.bill.id, product_id: shoppingCartItems[i].id, quantity: shoppingCartItems[i].quantity})
            .then((res) => {
                if (res.status === 200)
                {
                }
            })
            .catch(error => alert('Login to Purchase!'));
        }

        await get(`/bills/${this.state.bill.id}`)
        .then((response) => {
            if (response.status === 200)
            {
                console.log(response.data);
                this.setState({
                    bill: response.data
                })
            }
        })
        this.handleSendMail();
    }

    handleSendMail()
    {
        var contentmail = `<b>Dear, ${localStorage.getItem('username')}</b><br>`+
                       `<p>Thanks for visiting and buying in our store. We are very happy that you found products you are looking for. Here is your Bill:</p>`+
                       `<h3>BILL HD${this.state.bill.id}</h3><br>`+
                        `<b>TOTAL:</b> ${formatQuantity(this.state.bill.total)} VND`;
        post(`/bills/sendmail/${this.state.bill.id}`, {from: 'ps4gamemachine@gmail.com', to: this.state.user.email, subject: "THE PLAYSTATION SHOP - CONFIRM BILL", content: contentmail})
        .then((response) => {
            if (response.status === 200)
            {
                alert('Thank you for Purchasing, Confirm your email!');
                window.location.href='/WebPlayStation';
            }
        })
        .catch((error) => console.log(error));
    }

    componentWillUnmount() {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }

    render() {
        return (
            <div>
                <h3 style={{textAlign: 'center', marginTop: '1rem'}}>THE ORDER</h3>
                <div style={{marginLeft: '35rem'}}>
                    <h4 className='info-user'>Full Name: {this.state.user.name}</h4>
                    <h4 className='info-user' style={{marginLeft: '34.5rem'}}>Address: {this.state.user.address}</h4>
                </div>
                <div style={{marginLeft: '35rem'}}>
                    <h4 className='info-user'>Email: {this.state.user.email}</h4>
                    <h4 style={{marginLeft: '28rem'}} className='info-user'>Phone: {this.state.user.phone}</h4>
                </div>
                
                <Table celled className="order-confirm">
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell textAlign="center">No.</Table.HeaderCell>
                            <Table.HeaderCell textAlign="center">Product</Table.HeaderCell>
                            <Table.HeaderCell textAlign="center">Name</Table.HeaderCell>
                            <Table.HeaderCell textAlign="center">Price</Table.HeaderCell>
                            <Table.HeaderCell textAlign="center">Quantity</Table.HeaderCell>
                            <Table.HeaderCell textAlign="center">Total</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {
                            this.state.ShoppingCartItems.map((item, index) =>
                                <Table.Row key={item.id}>
                                    <Table.Cell textAlign="center">{index + 1}</Table.Cell>
                                    <Table.Cell textAlign="center"><Image style={{height: '75px'}} src={`data:image/jpeg;base64,${item.url}`}/></Table.Cell>
                                    <Table.Cell textAlign="center">{item.name}</Table.Cell>
                                    <Table.Cell textAlign="center">{formatCurrency(item.price)}</Table.Cell>
                                    <Table.Cell textAlign="center">{item.quantity}</Table.Cell>
                                    <Table.Cell textAlign="center">{formatCurrency(item.price * item.quantity)}</Table.Cell>
                                </Table.Row>
                            )
                        }
                    </Table.Body>
                </Table>

                <Header style={{marginLeft: '100rem'}}>TOTAL: {this.getTotal()}</Header>
                <Button positive icon='checkmark' labelPosition='right' content="Confirm" onClick={this.onCheckOut} style={{marginLeft: '100rem', marginBottom: '1rem'}}/>
                <div className={this.state.ShoppingCartItems.length < 3 ? "fixed-bottom": ''}>
                    <Footer/>
                </div>
            </div>
        )
    }
}
