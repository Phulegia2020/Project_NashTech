import React, { Component } from 'react';
import {Table, Button, Header, Image, Icon} from 'semantic-ui-react';
import {formatCurrency, formatQuantity} from "../../../Utils/Utils";
import "./Order.css";
import Footer from "../Footer/Footer";
import { get, post } from '../../../Utils/httpHelper';
import { Input, Label } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class Order extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ShoppingCartItems: [],
            bill: {},
            billDetails: [],
            user: {},
            type: 'cod',
            //loading: false
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
        // return formatCurrency(total);
        return total;
    }

    async onCheckOut(){
        const shoppingCartItems = JSON.parse(localStorage.getItem('shopping-cart') || '[]');
        if (shoppingCartItems.length == 0)
        {
            alert('The Order is empty. Can not Confirm!');
            return;
        }
        if (this.state.type === 'cod')
        {
            // await this.setState({
            //     loading: true
            // })
            toast('Vui lòng chờ xử lý hóa đơn!');
        }
        // if (this.state.type === 'cod')
        // {
            await post('/bills', {total: 0, user_id: localStorage.getItem('user_id'), status: 'Waiting'})
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
                    //console.log(response.data);
                    this.setState({
                        bill: response.data
                    })
                }
            })
            //localStorage.setItem('shopping-cart', []);

            this.handleSendMail();

            // console.log('paypal');
        // }
        // else 
        if (this.state.type === 'paypal')
        {
            var pay = (this.state.bill.total) / 20000;
            // var pay = 5;
            post(`/payment/pay?price=${pay}`)
            .then((response) => {
                if (response.status === 200)
                {
                    window.location.href=`${response.data}`;
                    //console.log(response.data);
                }
            })
            .catch(error => console.log(error));

            // alert('paypal');
            // console.log(pay);
        }
        // else
        // {
        //     toast('Vui lòng chờ xử lý thanh toán');
        // }
    }

    handleSendMail()
    {
        // var contentmail = `<b>Dear, ${localStorage.getItem('username')}</b><br>`+
        //                `<p>Thanks for visiting and buying in our store. We are very happy that you found products you are looking for. Here is your Bill:</p>`+
        //                `<h3>BILL HD${this.state.bill.id}</h3><br>`+
        //                 `<b>TOTAL:</b> ${formatQuantity(this.state.bill.total)} VND`;
        var contentmail = `<b>Chào, ${localStorage.getItem('username')}</b><br>`+
                       `<p>Cám ơn quý khách đã ghé thăm và mua sản phẩm tại cửa hàng. Chúng tôi rất vui khi bạn đã mua được những sản phẩm mà bạn đang tìm kiếm. Đay là hóa đơn của bạn:</p>`+
                       `Hóa Đơn <h3>HD${this.state.bill.id}</h3><br>`+
                        `Tổng Cộng: <b>${formatQuantity(this.state.bill.total)} VND</b>`;
        post(`/bills/sendmail/${this.state.bill.id}`, {from: 'ps4gamemachine@gmail.com', to: this.state.user.email, subject: "THE PLAYSTATION SHOP - CONFIRM BILL", content: contentmail})
        .then((response) => {
            if (response.status === 200)
            {
                
                // this.setState({
                //     loading: false
                // })
                
                if (this.state.type === 'cod')
                {
                    // alert('Thank you for Purchasing, Confirm your email!');
                    // window.location.href='/WebPlayStation';
                    window.location.href='/WebPlayStation/success';
                }
            }
        })
        .catch((error) => console.log(error));
        // this.setState({
        //     loading: false
        // })
        
        // if (this.state.type === 'cod')
        // {
        //     alert('Thank you for Purchasing, Confirm your email!');
        //     window.location.href='/WebPlayStation';
        // }
    }

    changeValue(e){
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    componentWillUnmount() {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }

    render() {
        return (
            <div className='order-bill'>
                {/* <h3 style={{textAlign: 'center', marginTop: '1rem'}}>THE ORDER</h3>
                <div style={{marginLeft: '35rem'}}>
                    <h4 className='info-user'>Full Name: {this.state.user.name}</h4>
                    <h4 className='info-user' style={{marginLeft: '34.5rem'}}>Address: {this.state.user.address}</h4>
                </div>
                <div style={{marginLeft: '35rem'}}>
                    <h4 className='info-user'>Email: {this.state.user.email}</h4>
                    <h4 style={{marginLeft: '28rem'}} className='info-user'>Phone: {this.state.user.phone}</h4>
                </div> */}
                
                <div className="order-confirm">
                    <h3 style={{fontWeight:'bold'}}>Thanh Toán Đơn Hàng</h3>
                    {/* <div id='info'>
                        <h4 >Full Name: {this.state.user.name}</h4>
                        <h4 >Address: {this.state.user.address}</h4>
                    </div>
                    <div id='info-user'>
                        <h4 >Email: {this.state.user.email}</h4>
                        <h4 >Phone: {this.state.user.phone}</h4>
                    </div> */}
                    <Table celled>
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
                            {/* <div className='scroll-table-order'> */}
                            {
                                this.state.ShoppingCartItems.map((item, index) =>
                                    <Table.Row key={item.id}>
                                        <Table.Cell textAlign="center" >{index + 1}</Table.Cell>
                                        <Table.Cell textAlign="center" ><Image style={{height: '75px'}} src={`data:image/jpeg;base64,${item.url}`}/></Table.Cell>
                                        <Table.Cell textAlign="center" >{item.name}</Table.Cell>
                                        <Table.Cell textAlign="center" >{formatCurrency(item.price)}</Table.Cell>
                                        <Table.Cell textAlign="center" >{item.quantity}</Table.Cell>
                                        <Table.Cell textAlign="center" >{formatCurrency(item.price * item.quantity)}</Table.Cell>
                                    </Table.Row>
                                )
                            }
                            {/* </div> */}
                        </Table.Body>
                    </Table>
                    <Header style={{marginLeft: '75rem'}}>TOTAL: {formatCurrency(this.getTotal())}</Header>
                    <Button positive icon='checkmark' labelPosition='right' content="Confirm" onClick={this.onCheckOut} style={{marginLeft: '75rem'}}/>
                    {/* loading={this.state.loading} */}
                </div>

                <div className='info-user'>
                    <h4 style={{fontWeight:'bold'}}>Thông Tin Khách Hàng</h4>
                    <p><Icon name="user circle" size="large"/>{this.state.user.name}</p>
                    <p><Icon name="home" size="large"/>{this.state.user.address}</p>
                    <p><Icon name="mail outline" size="large"/>{this.state.user.email}</p>
                    <p><Icon name="phone" size="large"/>{this.state.user.phone}</p>
                </div>

                <div className='payment'>
                    <h4 style={{fontWeight:'bold', textAlign:'center'}}>Phương Thức Thanh Toán</h4>
                    <Label>
                        <Input type="radio" name="type"  value='cod' checked={this.state.type === 'cod'} onChange={(e) => this.changeValue(e)}/>{' '}
                        <Icon name="money bill alternate" size="large"/>
                        Thu tiền khi giao hàng
                    </Label>
                    <br/>
                    <Label>
                        <Input type="radio" name="type" value = 'paypal' checked={this.state.type === 'paypal'} onChange={(e) => this.changeValue(e)}/>{' '}
                        <Icon name="cc paypal" size="large"/>
                        Thanh toán trực tuyến PayPal ({formatQuantity(this.getTotal() / 20000) } USD)
                        {/* credit card alternative */}
                    </Label>
                </div>
                {/* <Header style={{marginLeft: '100rem'}}>TOTAL: {this.getTotal()}</Header>
                <Button positive icon='checkmark' labelPosition='right' content="Confirm" onClick={this.onCheckOut} style={{marginLeft: '100rem', marginBottom: '1rem'}}/> */}
                <div className={this.state.ShoppingCartItems.length < 4 ? "fixed-bottom": ''}>
                    <Footer/>
                </div>
                <ToastContainer position="bottom-center"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick={false}
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover/>
            </div>
        )
    }
}
