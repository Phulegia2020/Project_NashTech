import React, { Component } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { withRouter } from 'react-router-dom';
import { get, post } from '../../../Utils/httpHelper';
import {formatCurrency, formatQuantity} from "../../../Utils/Utils";

class Success extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bill: {},
            email: ""
        };
    }

    async componentDidMount()
    {
        var pttt = "";
        if (this.props.location.state != null)
        {
            pttt = this.props.location.state.pttt;
        }
        else
        {
            pttt = 'Thanh toàn trực tuyến paypal'
        }
        
        const shoppingCartItems = JSON.parse(localStorage.getItem('shopping-cart') || '[]');
        localStorage.setItem('shopping-cart', []);
        var billId = "";
        // console.log(pttt);
        // console.log(shoppingCartItems);

        await get(`/users/${localStorage.getItem('user_id')}`)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    email: response.data.email
                });
            }
        })

        await post('/bills', {total: 0, user_id: localStorage.getItem('user_id'), status: 'Waiting'})
        .then((response) => {
            if (response.status === 200)
            {
                // this.setState({
                //     bill: response.data
                // })
                billId = response.data.id;
            }
        })
        .catch(error => {});

        for (let i = 0; i < shoppingCartItems.length; i++) {
            await post('/billDetails', {bill_id: billId, product_id: shoppingCartItems[i].id, quantity: shoppingCartItems[i].quantity})
            .then((res) => {
                if (res.status === 200)
                {
                }
            })
            .catch(error => {});
        }

        await get(`/bills/${billId}`)
        .then((response) => {
            if (response.status === 200)
            {
                //console.log(response.data);
                this.setState({
                    bill: response.data
                })
            }
        })

        var contentmail = `<b>Chào, ${localStorage.getItem('username')}</b><br/>`+
                       `<p>Cám ơn quý khách đã ghé thăm và mua sản phẩm tại cửa hàng. Chúng tôi rất vui khi bạn đã mua được những sản phẩm mà bạn đang tìm kiếm. Đây là hóa đơn của bạn:</p>`+
                       `Hóa Đơn <h3>#HD${this.state.bill.id}</h3>`+
                       `Tổng giá trị đơn hàng: <b>${formatQuantity(this.state.bill.total)} VNĐ</b><br/>`+
                       `Phương thức thanh toán: <b>${pttt}</b><br/>`;
        post(`/bills/sendmail/${this.state.bill.id}`, {from: 'ps4gamemachine@gmail.com', to: this.state.email, subject: "THE PLAYSTATION SHOP - XÁC NHẬN HÓA ĐƠN", content: contentmail})
        .then((response) => {
            if (response.status === 200)
            {
                // localStorage.setItem('shopping-cart', []);
            }
        })
        .catch((error) => console.log(error));

        window.onbeforeunload = function () {
            window.history.replaceState(null, "");
        }.bind(this);
    }

    componentWillUnmount() {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }

    render() {
        return (
            <div style={{marginTop:'50px'}}>
                <div className="row">
                    <div className="col-md-12 text-center">
                        {/* <i className="fas fa-check-circle fa-5x text-success"></i> */}
                        <FontAwesomeIcon icon={faCheckCircle} className="fas fa-check-circle fa-5x text-success"/>
                        <h2 className="display-3 text-black">Cám ơn!</h2>
                        <p className="lead mb-5">Bạn đã thanh toán thành công.</p>
                        <p><a href="/" className="btn btn-lg btn-primary">Quay về cửa hàng</a></p>
                    </div>
                </div>
            </div>
        )
    }
}
export default withRouter(Success);