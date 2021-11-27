import React, { Component } from 'react'
import { Checkbox, Form, Radio, Label } from 'semantic-ui-react';
import {post} from "./../../../Utils/httpHelper";
import { withRouter } from "react-router";
import {get} from '../../../Utils/httpHelper';
import { checkPhoneNumber } from '../../../Utils/Utils';
import "./SignUp.css";
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
        Error: "",
        key: "",
        users: [],
        show: false};
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
    }

    handleShowPassword(e)
	{
		e.preventDefault();
		this.setState({
			show: !this.state.show
		})
	}

    handleSubmit = (event) => {
        for (let i = 0; i < this.state.users.length; i++)
        {
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
        }
        if (!checkPhoneNumber(event.target.phone.value.trim()))
        {
            console.log('error')
            this.setState({
                key: 'phone'
            })
            this.setState({
                Error: "Số điện thoại phải có 10 chữ số và bắt đầu bằng số 0!"
            });
            return;
        }
        if (event.target.password.value.length < 6)
		{
			this.setState({
				key: 'password'
			})
			this.setState({
				Error: "Mật khẩu phải có ít nhất 6 ký tự!"
			});
			return;
		}
        this.setState({
            gender: event.target.gender.value
        });
        post(`/auth/signup`, {name: this.state.name, gender: this.state.gender, address: this.state.address,
            email: this.state.email, phone: this.state.phone, username: this.state.username,
            password: this.state.password, role: this.state.role})
        .then((response) => {
            if (response.status === 200)
            {
                toast.success('Đăng ký thành công!')
                setTimeout(() => this.props.history.push("/WebPlayStation/login"), 1500);
            }
        })
        .catch(error => console.log(error));
    }

    componentWillUnmount() {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }
    
    render() {
        return (
            <div className='sign-up'>
                <div className="site-section mt-3 mb-3">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-12">
                                    <h2 className="h3 mb-3 text-black title-profile">Đăng kí tài khoản</h2>
                                </div>
                                <div className="col-md-6" >
                                <Form onSubmit={(event) => this.handleSubmit(event)}>
                                        <div className="p-3 p-lg-6 border" id="signup-form">
                                            <div className="form-group row">
                                                <div className="col-md-12">
                                                    <label className="text-black">Họ và tên<span
                                                        className="text-danger">*</span></label>
                                                    <Form.Input placeholder='Họ tên' name='name' value={this.state.name} onChange={this.handleChange} required/>
                                                </div>
                                            </div>
                                            <div className="form-group row mt-3">
                                                <div className="col-md-12">
                                                    <Form.Group inline>
                                                    <label className="text-black">Giới Tính</label>
                                                        <Form.Field
                                                            label='Male'
                                                            control={Radio}
                                                            value='Male'
                                                            name='gender'
                                                            onChange={this.handleChange}
                                                            checked={this.state.gender === 'Male'}
                                                        />
                                                        <Form.Field
                                                            label='Female'
                                                            control={Radio}
                                                            value='Female'
                                                            name='gender'
                                                            onChange={this.handleChange}
                                                            checked={this.state.gender === 'Female'}
                                                        />
                                                    </Form.Group>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <div className="col-md-12">
                                                    <label className="text-black">Địa chỉ<span
                                                        className="text-danger">*</span></label>
                                                    <Form.Input placeholder='1 Đường, Phường 2, Quận 3, Thành phố Hồ Chí Minh' name='address' value={this.state.address} onChange={this.handleChange} required/>
                                                </div>
                                            </div>
                                            <div className="form-group row mt-3">
                                                <div className="col-md-12">
                                                    <label className="text-black">Email<span
                                                        className="text-danger">*</span></label>
                                                    <Form.Input type="email" placeholder='abc@gmail.com' name='email' value={this.state.email} onChange={this.handleChange} required/>
                                                    {this.state.key === 'email' ? <Label basic color='red' pointing='left'>{this.state.Error}</Label> : '' }
                                                </div>
                                            </div>
                                            <div className="form-group row mt-3">
                                                <div className="col-md-12">
                                                    <label className="text-black">Số điện thoại<span
                                                        className="text-danger">*</span></label>
                                                    <Form.Input placeholder='0123******' type="text" maxLength={10} minLength={10} name='phone' value={this.state.phone} onChange={this.handleChange} required/>
                                                    {this.state.key === 'phone' ? <Label basic color='red' pointing='left'>{this.state.Error}</Label> : '' }
                                                </div>
                                            </div>
                                            <div className="form-group row mt-3">
                                                <div className="col-md-12">
                                                    <label className="text-black">Tên tài khoản<span
                                                        className="text-danger">*</span></label>
                                                    <Form.Input placeholder='Tài khoản' minLength="3" name='username' value={this.state.username} onChange={this.handleChange} required/>
                                                    {this.state.key === 'username' ? <Label basic color='red' pointing='left'>{this.state.Error}</Label> : '' }
                                                </div>
                                            </div>
                                            <div className="form-group row mt-3">
                                                <div className="col-md-12">
                                                    <label className="text-black">Mật khẩu<span
                                                        className="text-danger">*</span></label>
                                                    <Form.Input placeholder='Mật khẩu' minLength="6" type={this.state.show === false? 'password' : 'text'} name='password' value={this.state.password} onChange={this.handleChange} required/>
                                                    {this.state.key === 'password' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                                                    <Checkbox label='Hiển thị' onChange={(e) => this.handleShowPassword(e)} className="cb"/>
                                                </div>
                                            </div>
                                            <br/>
                                            <div className="form-group row">
                                                <div className="col-lg-12">
                                                    <button type="submit" className="btn btn-success btn-lg btn-block">ĐĂNG KÍ</button>
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