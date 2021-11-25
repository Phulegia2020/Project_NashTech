import React, { Component } from 'react'
import { Form, Label } from 'semantic-ui-react';
import {put} from "./../../../Utils/httpHelper";
import { withRouter } from "react-router";
import {get} from '../../../Utils/httpHelper';
import { checkPhoneNumber } from '../../../Utils/Utils';
import "../SignUp/SignUp.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class SignUp extends Component {
    constructor(props) {
		super(props);
		this.state = { name: "", gender: "Male",
        address: "",
        email: "",
        phone: "",
        username: "",
        password: "",
        role: "",
        active_status: "",
        Error: "",
        key: "",
        users: [],
        btndis: true};
    }
    
    componentDidMount(){
        get("/users")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({users: response.data});
            }
        })
        .catch(error => {console.log(error)})

        get(`/users/${localStorage.getItem('user_id')}`)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({name: response.data.name, username: response.data.account, gender: response.data.gender, active_status: response.data.active_status,
                               address: response.data.address, email: response.data.email, phone: response.data.phone, role: response.data.role_id});
            }
        })
        .catch(error => {console.log(error)})
    }

    handleChange = (e, { name, value }) => {
        if (e.target.name === 'username' || e.target.name === 'phone' || e.target.name === 'email')
        {
            this.setState({
                [name]: value.trim()
            });
        }
        else{
            this.setState({ [name]: value });
        }
        this.setState({
            btndis: false
        })
    }

    handleSubmit = (event) => {
        for (let i = 0; i < this.state.users.length; i++)
        {
            if (this.state.users[i].id != localStorage.getItem("user_id"))
            {
                if (this.state.users[i].account === event.target.username.value.trim())
                {
                    this.setState({
                        key: 'username'
                    })
                    this.setState({
                        Error: "Tên tài khoản này đã được sử dụng!"
                    });
                    return;
                }
                if (this.state.users[i].email === event.target.email.value.trim())
                {
                    this.setState({
                        key: 'email'
                    })
                    this.setState({
                        Error: "Email này đã được sử dụng!"
                    });
                    return;
                }
                if (this.state.users[i].phone === event.target.phone.value.trim())
                {
                    this.setState({
                        key: 'phone'
                    })
                    this.setState({
                        Error: "Số điện thoại này đã được sử dụng!"
                    });
                    return;
                }
            }
        }
        if (!checkPhoneNumber(event.target.phone.value.trim()))
        {
            console.log('error')
            this.setState({
                key: 'phone'
            })
            this.setState({
                Error: "Số điện thoại phải có 10 chữ số và bắt đầu bẳng số 0!"
            });
            return;
        }
        put(`/users/${localStorage.getItem('user_id')}`, {name: this.state.name.trim(), gender:this.state.gender, address: this.state.address.trim(), email: this.state.email.trim(),
            phone: this.state.phone, account: this.state.username, active_status: this.state.active_status, role_id: this.state.role})
        .then((response) => {
            if (response.status === 200)
            {
                toast.success('Cập nhật thông tin thành công!')
                setTimeout(() => window.location.href="/WebPlayStation/profile", 1500);
            }
        })
        .catch(error => {alert('Cập nhật thất bại!')});
    }

    componentWillUnmount() {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }
    
    render() {
        return (
            <div className="info-profile">
                <div className="site-section mt-3 mb-4">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-2 col-md-3 col-sm-3"></div>
                                <div className="col-md-8" >
                                    <div className="col-lg-12 col-md-12 col-sm-12 mt-3">
                                        <h2 className="h3 mb-3 text-black title-info">Thông tin tài khoản</h2>
                                    </div>
                                    <Form onSubmit={(event) => this.handleSubmit(event)}>
                                        <div className="p-3 p-lg-6 border" id="account-form">
                                            <div className="form-group row">
                                                <div className="col-md-2">
                                                    <label className="text-black">Họ tên</label>
                                                </div>
                                                <div className="col-md-10">
                                                    <Form.Input placeholder='Họ tên' name='name' value={this.state.name} onChange={this.handleChange} required/>
                                                </div>
                                            </div>
                                            <div className="form-group row mt-5">
                                                <div className="col-md-2">
                                                    <label>Giới Tính</label>
                                                </div>
                                                <div className="col-md-10">
                                                    <Form.Group inline>
                                                        <Form.Radio
                                                            label='Nam'
                                                            value="Male"
                                                            name='gender'
                                                            checked={this.state.gender == "Male"}
                                                            onChange={this.handleChange}
                                                        />
                                                        <Form.Radio
                                                            label='Nữ'
                                                            value="Female"
                                                            name='gender'
                                                            checked={this.state.gender == "Female"}
                                                            onChange={this.handleChange}
                                                        />
                                                    </Form.Group>
                                                </div>
                                            </div>
                                            <div className="form-group row mt-5">
                                                <div className="col-md-2">
                                                <label>Tài Khoản</label>
                                                </div>
                                                <div className="col-md-10">
                                                    <Form.Input placeholder='Tên tài khoản' name='username' value={this.state.username} onChange={this.handleChange} required disabled id="input-username"/>
                                                    {this.state.key === 'username' ? <Label basic color='red' pointing='left'>{this.state.Error}</Label> : '' }
                                                </div>
                                            </div>
                                            <div className="form-group row mt-5">
                                                <div className="col-md-2">
                                                    <label className="text-black">Email</label>
                                                </div>
                                                <div className="col-md-10">
                                                    <Form.Input type="email" placeholder='Email' name='email' value={this.state.email} onChange={this.handleChange} required/>
                                                    {this.state.key === 'email' ? <Label basic color='red' pointing='left'>{this.state.Error}</Label> : '' }
                                                </div>
                                            </div>
                                            <div className="form-group row mt-5">
                                                <div className="col-md-2">
                                                    <label>Địa chỉ</label>
                                                </div>
                                                <div className="col-md-10">
                                                    <Form.Input placeholder='Địa chỉ' name='address' value={this.state.address} onChange={this.handleChange} required/>
                                                </div>
                                            </div>
                                            <div className="form-group row mt-5">
                                                <div className="col-md-2">
                                                    <label className="text-black">Số điện thoại</label>
                                                </div>
                                                <div className="col-md-10">
                                                    <Form.Input placeholder='Số điện thoại' type="text" name='phone' maxLength={10} minLength={10} value={this.state.phone} onChange={this.handleChange} required/>
                                                    {this.state.key === 'phone' ? <Label basic color='red' pointing='left'>{this.state.Error}</Label> : '' }
                                                </div>
                                            </div>
                                            <br/>
                                            <div className="form-group row">
                                                <div className="col-lg-5"></div>
                                                <div className="col-lg-4">
                                                    <button type="submit" className="btn btn-danger btn-lg btn-block" disabled={this.state.btndis}>Cập nhật</button>
                                                </div>
                                            </div>
                                        </div>
                                    </Form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ToastContainer position="top-center"
                    autoClose={1500}
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

export default withRouter(SignUp);