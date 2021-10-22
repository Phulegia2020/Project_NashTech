import React, { Component } from 'react'
import { get, put } from '../../Utils/httpHelper'
import { withRouter } from "react-router";
import { Col, Row, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import "../Category/Category.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class UpdatePlaceOrderDetails extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            id: this.props.match.params.id,
            quantity: 0,
            price: 0,
            product_id: "",
            placeorder_id: "",
            Error: "",
            key: "",
        }
    }
    
    componentDidMount(){
        get(`/placeorderDetails/${this.state.id}`)
        .then((response) => {
            console.log(response.data);
            if (response.status === 200)
            {
                this.setState({
                    quantity: response.data.quantity,
                    price: response.data.price,
                    product_id: response.data.product_id,
                    placeorder_id: response.data.placeorder_id
                })
            }
        });
    }

    changeValue(e){
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleUpdate(event){
        event.preventDefault();
        if (this.state.quantity <= 0)
        {
            this.setState({
                key: 'quantity'
            })
            this.setState({
                Error: "Số lượng không nhỏ hơn 1!"
            });
            return;
        }
        if (event.target.price.value.trim() <= 0)
        {
            this.setState({
                key: 'price'
            })
            this.setState({
                Error: "Giá không nhỏ hơn 1!"
            });
            return;
        }
        put(`/placeorderDetails/${this.state.id}`, {quantity: this.state.quantity, price: this.state.price, product_id: this.state.product_id, placeorder_id: this.state.placeorder_id})
        .then((response) => {
            if (response.status === 200)
            {
                this.props.history.push(`/admin/placeorder/${this.state.placeorder_id}`);
            }
        })
        // .catch((error) => alert('The Place Order had already this product'));
        .catch((error) => toast.error('Phiếu đặt đã có sản phẩm này!'));
    }

    handleClear = () => {
        this.setState({
            quantity: 0,
            price: 0,
        });
        this.props.history.push(`/admin/placeorder/${this.state.placeorder_id}`);
    }

    componentWillUnmount() {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }

    render() {
        return (
            <div className="update-form">
                <h3>Cập Nhật Chi Tiết</h3>
                {/* <Row form>
                    <Col md={4}> */}
                        <Form onSubmit={(event) => this.handleUpdate(event)}>
                        <FormGroup>
                            <Label htmlFor="quantity">Số Lượng</Label>
                            <Input type="number" name="quantity" id="quantity" placeholder="100" onChange={(e) => this.changeValue(e)} value = {this.state.quantity} required="required"/>
                            {this.state.key === 'quantity' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="quantity">Giá</Label>
                            <Input type="number" name="price" id="quantity" placeholder="100" onChange={(e) => this.changeValue(e)} value = {this.state.price} required="required"/>
                            {this.state.key === 'price' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                        </FormGroup>
                        <FormGroup className="mb-2">
                            <Label htmlFor="product">Mã Máy</Label>
                            <Input type="text" name="product_id" id="product" value = {this.state.product_id} onChange={(e) => this.changeValue(e)} disabled />
                        </FormGroup>
                        <div className="mb-5">
                            <Button type="submit" outline color="warning" >Cập Nhật</Button>{' '}
                            <Button outline color="danger" onClick={this.handleClear.bind(this)}>Hủy</Button>
                        </div>
                        </Form>
                    {/* </Col>
                </Row> */}
                <ToastContainer position="top-center"
                    autoClose={2000}
                    hideProgressBar
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

export default withRouter(UpdatePlaceOrderDetails);