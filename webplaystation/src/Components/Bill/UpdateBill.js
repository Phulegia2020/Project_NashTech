import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { get, put } from '../../Utils/httpHelper';
import "../Category/Category.css";

class UpdateBill extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            id: this.props.match.params.id,
            total: 0,
            user_id: "",
            status: "",
            users: [],
            Error: "",
            key: "",
            destination: '',
            payment: ''
        }
    }
    
    componentDidMount(){
        get("/users/customer")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({users: response.data});
            }
        })
        .catch(error => {console.log(error)})

        get(`/bills/${this.state.id}`)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    total: response.data.total,
                    user_id: response.data.user_id,
                    status: response.data.status,
                    destination: response.data.destination,
                    payment: response.data.payment
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
        if (event.target.total.value.trim() <= 0)
        {
            this.setState({
                key: 'total'
            })
            this.setState({
                Error: "Tổng tiền không nhỏ hơn 1!"
            });
            return;
        }
        put(`/bills/${this.state.id}`, {total: this.state.total, user_id: this.state.user_id, status: this.state.status, destination: this.state.destination, payment: this.state.payment})
        .then((response) => {
            if (response.status === 200)
            {
                this.props.history.push("/admin/bill");
            }
        })
    }

    handleClear = () => {
        this.setState({
            total: 0,
            user_id: "",
            status: ""
        });
        this.props.history.push("/admin/bill");
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
                <h3>Cập Nhật Hóa Đơn</h3>
                <Form onSubmit={(event) => this.handleUpdate(event)}>
                    <FormGroup>
                        <Label htmlFor="total">Tổng Tiền</Label>
                        <Input type="number" name="total" id="total" placeholder="VND" onChange={(e) => this.changeValue(e)} value = {this.state.total} required="required" disabled/>
                        {this.state.key === 'total' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                    </FormGroup>
                    
                    <FormGroup className="mb-2">
                        <Label htmlFor="user">Khách Hàng</Label>
                        <Input type="select" name="user_id" id="user" value = {this.state.user_id} onChange={(e) => this.changeValue(e)}>
                            {
                                this.state.users.map((u) => (
                                    <option key={u.id} value={u.id}>{u.name}</option>
                                ))
                            }
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="destination">Địa điểm giao hàng</Label>
                        <Input type="text" name="destination" id="destination" placeholder="Địa điểm giao hàng..." onChange={(e) => this.changeValue(e)} value = {this.state.destination} required="required"/>
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="payment">Thanh Toán</Label>
                        <Input type="select" name="payment" id="payment" value = {this.state.payment} onChange={(e) => this.changeValue(e)} disabled>
                            <option value="Cod">Tiền Mặt</option>
                            <option value="PayPal">PayPal</option>
                        </Input>
                    </FormGroup>
                    <FormGroup className="mb-2">
                        <Label htmlFor="status">Trạng Thái</Label>
                        <Input type="select" name="status" id="status" value = {this.state.status} onChange={(e) => this.changeValue(e)} disabled>
                            <option value="Done">Hoàn Tất</option>
                            <option value="Waiting">Chờ Xác Nhận</option>
                        </Input>
                    </FormGroup>
                    
                    <div className="mb-5">
                        <Button type="submit" outline color="warning" >Cập Nhật</Button>{' '}
                        <Button outline color="danger" onClick={this.handleClear.bind(this)}>Hủy</Button>
                    </div>
                </Form>
            </div>
        )
    }
}

export default withRouter(UpdateBill);