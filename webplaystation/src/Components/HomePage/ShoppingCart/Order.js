import React, { Component } from 'react';
import {Table, Button, Header, Image, Icon} from 'semantic-ui-react';
import {formatCurrency, formatQuantity} from "../../../Utils/Utils";
import "./Order.css";
import Footer from "../Footer/Footer";
import { get, post } from '../../../Utils/httpHelper';
import { Input, Label } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarked } from '@fortawesome/free-solid-svg-icons';

class Order extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ShoppingCartItems: [],
            bill: {},
            billDetails: [],
            user: {},
            type: 'cod',
            destination: ''
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
                    user: response.data,
                    destination: response.data.address
                })
            }
        })
        .catch(error => console.log(error));
    }

    getTotal() {
        var total = Object.keys(this.state.ShoppingCartItems).reduce((previous, key) => {
            return previous + this.state.ShoppingCartItems[key].price * this.state.ShoppingCartItems[key].quantity;
        }, 0);
        return total;
    }

    async onCheckOut(){
        const shoppingCartItems = JSON.parse(localStorage.getItem('shopping-cart') || '[]');
        if (shoppingCartItems.length == 0)
        {
            toast('Giỏ hàng trống!');
            return;
        }
        if (this.state.destination === '')
        {
            toast('Địa chỉ nhận hàng không tồn tại!');
            return;
        }
        localStorage.setItem('destination', this.state.destination);
        if (this.state.type === 'cod')
        {
            toast('Vui lòng chờ xử lý hóa đơn!');
            setTimeout(() => this.props.history.push("/WebPlayStation/success", {pttt: 'Thanh toán tiền mặt khi nhận hàng'}), 2000);
        }
        if (this.state.type === 'paypal')
        {
            var pay = this.getTotal() / 20000;
            post(`/payment/pay?price=${pay}`)
            .then((response) => {
                if (response.status === 200)
                {
                    window.location.href=`${response.data}`;
                }
            })
            .catch(error => console.log(error));
        }
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
                <div className="order-confirm">
                    <h3 style={{fontWeight:'bold'}}>Thanh Toán Đơn Hàng</h3>
                    <Table celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell textAlign="center">No.</Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">Máy</Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">Tên</Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">Đơn Giá</Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">Số Lượng</Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">Tổng Giá</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {
                                this.state.ShoppingCartItems.map((item, index) =>
                                    <Table.Row key={item.id}>
                                        <Table.Cell textAlign="center" >{index + 1}</Table.Cell>
                                        <Table.Cell textAlign="center" >
                                            <Image style={{height: '75px'}} src={item.url}/>
                                        </Table.Cell>
                                        <Table.Cell textAlign="center" >{item.name}</Table.Cell>
                                        <Table.Cell textAlign="center" >{formatCurrency(item.price)}</Table.Cell>
                                        <Table.Cell textAlign="center" >{item.quantity}</Table.Cell>
                                        <Table.Cell textAlign="center" >{formatCurrency(item.price * item.quantity)}</Table.Cell>
                                    </Table.Row>
                                )
                            }
                        </Table.Body>
                    </Table>
                    <Header style={{marginLeft: '75rem'}}>Tổng Tiền: {formatCurrency(this.getTotal())}</Header>
                    <Button positive icon='checkmark' labelPosition='right' content="Xác Nhận" onClick={this.onCheckOut} style={{marginLeft: '75rem'}}/>
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
                    </Label>
                </div>

                <div className='destination-form'>
                    <div className="title-destination">
                        <FontAwesomeIcon icon={faMapMarked} size='lg'/>{' '}
                        <h4 style={{fontWeight:'bold', textAlign:'center'}}>Địa Điểm Nhận Hàng</h4>
                    </div>
                    <Label>
                        <Input type="text" name="destination" placeholder="Địa điểm nhận hàng..." value={this.state.destination} onChange={(e) => this.changeValue(e)} required className="input-destination"/>
                    </Label>
                </div>
                <div className={this.state.ShoppingCartItems.length < 4 ? "fixed-bottom": ''}>
                    <Footer/>
                </div>
                <ToastContainer position="bottom-center"
                    autoClose={1000}
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
export default withRouter(Order);