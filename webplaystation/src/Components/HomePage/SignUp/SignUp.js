import React, { Component } from 'react'
import { Button, Checkbox, Form, Radio, Label } from 'semantic-ui-react';
import {
	Segment,
	Grid,
} from 'semantic-ui-react'
import {post, postLogin} from "./../../../Utils/httpHelper";
import { withRouter } from "react-router";
import {get} from '../../../Utils/httpHelper';
import { checkPhoneNumber } from '../../../Utils/Utils';
import "./SignUp.css";

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
        // this.props.handleChatBot();
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
        if (event.target.password.value.length < 6)
		{
			this.setState({
				key: 'password'
			})
			this.setState({
				Error: "Password is at least 6 characters!"
			});
			return;
		}
        for (let i = 0; i < this.state.users.length; i++)
        {
            if (this.state.users[i].account === event.target.username.value.trim())
            {
                this.setState({
                    key: 'username'
                })
                this.setState({
                    Error: "This username is existed!"
                });
                return;
            }
            if (this.state.users[i].email === event.target.email.value.trim())
            {
                this.setState({
                    key: 'email'
                })
                this.setState({
                    Error: "This email is used already!"
                });
                return;
            }
            if (this.state.users[i].phone === event.target.phone.value.trim())
            {
                this.setState({
                    key: 'phone'
                })
                this.setState({
                    Error: "This phone number is existed!"
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
                Error: "Phone must be numbers and start with 0!"
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
                alert('Register Successfully!')
                postLogin('/auth/signin', {username: this.state.username, password: this.state.password})
                .then((response) => {
                    if (response.status === 200)
                    {
                        localStorage.setItem('accessToken', response.data.accessToken);
                        localStorage.setItem('user_id', response.data.id);
				        localStorage.setItem('username', response.data.username);
                        if (response.data.roles[0] === "USER")
                        {
                            this.props.history.push("/");
                        }
                    }
                    
                })
                .catch(error => console.log(error));
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
                {/* <Segment style={{ padding: '5em 0em', marginLeft: '600px' }} vertical>
                    
                    <Grid container stackable verticalAlign='middle'>
                        
                        <Grid.Row>
                            <Grid.Column width={8}>
                                <h2 className="title-profile">Register</h2>
                                <Form onSubmit={(event) => this.handleSubmit(event)}>
                                    <Form.Field >
                                        <label>Name</label>
                                        <Form.Input placeholder='Full Name' name='name' value={this.state.name} onChange={this.handleChange} required/>
                                    </Form.Field>
                                    <Form.Group inline>
                                        <label>Gender</label>
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
                                    <Form.Field inline required>
                                        <label>Username</label>
                                        <Form.Input placeholder='Username' name='username' value={this.state.username} onChange={this.handleChange} required/>
                                        {this.state.key === 'username' ? <Label basic color='red' pointing='left'>{this.state.Error}</Label> : '' }
                                    </Form.Field>
                                    <Form.Group inline>
                                        <Form.Field required inline>
                                            <label>Password</label>
                                            <Form.Input placeholder='123456' minLength="6" type={this.state.show === false? 'password' : 'text'} name='password' value={this.state.password} onChange={this.handleChange} required/>
                                            {this.state.key === 'password' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                                        </Form.Field>
                                        <Form.Field className="cb">
                                            <Checkbox label='Show password' onChange={(e) => this.handleShowPassword(e)} className="cb"/>
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Field>
                                        <label>Email</label>
                                        <Form.Input type="email" placeholder='abc@gmail.com' name='email' value={this.state.email} onChange={this.handleChange} required/>
                                        {this.state.key === 'email' ? <Label basic color='red' pointing='left'>{this.state.Error}</Label> : '' }
                                    </Form.Field>
                                    <Form.Field >
                                        <label>Address</label>
                                        <Form.Input placeholder='123 Main st, Ward, District, Ho Chi Minh City' name='address' value={this.state.address} onChange={this.handleChange} required/>
                                    </Form.Field>
                                    <Form.Field inline required>
                                        <label>Phone</label>
                                        <Form.Input placeholder='0123456789' type="text" maxLength={10} minLength={10} name='phone' value={this.state.phone} onChange={this.handleChange} required/>
                                        {this.state.key === 'phone' ? <Label basic color='red' pointing='left'>{this.state.Error}</Label> : '' }
                                    </Form.Field>
                                    <Button type='submit' color='google plus'>Sign Up</Button>
                                </Form>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment> */}

                {/* <df-messenger
                    intent="WELCOME"
                    chat-title="THE PLAYSTATION SHOP"
                    agent-id="3d2eb8db-0f5e-4a16-9c2a-3cea0cadb3a7"
                    language-code="en"
                ></df-messenger> */}

                <div className="site-section mt-3 mb-3">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-12">
                                    <h2 className="h3 mb-3 text-black">Đăng kí tài khoản</h2>
                                </div>
                                <div className="col-md-6" >
                                <Form onSubmit={(event) => this.handleSubmit(event)}>
                                        <div className="p-3 p-lg-6 border" id="signup-form">
                                            <div className="form-group row">
                                                <div className="col-md-12">
                                                    <label className="text-black">Họ và tên<span
                                                        className="text-danger">*</span></label>
                                                    <Form.Input placeholder='Full Name' name='name' value={this.state.name} onChange={this.handleChange} required/>
                                                    {/* <input path="displayName" type="text" class="form-control"
                                                        placeholder="Vui lòng nhập Họ và tên" />
                                                    <errors path="displayName" /> */}
                                                </div>
                                            </div>
                                            <div className="form-group row mt-3">
                                                <div className="col-md-12">
                                                    <Form.Group inline>
                                                    <label className="text-black">Gender</label>
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
                                                    <Form.Input placeholder='123 Main st, Ward, District, Ho Chi Minh City' name='address' value={this.state.address} onChange={this.handleChange} required/>
                                                    {/* <input path="displayName" type="text" class="form-control"
                                                        placeholder="Vui lòng nhập Họ và tên" />
                                                    <errors path="displayName" /> */}
                                                </div>
                                            </div>
                                            <div className="form-group row mt-3">
                                                <div className="col-md-12">
                                                    <label className="text-black">Email<span
                                                        className="text-danger">*</span></label>
                                                    <Form.Input type="email" placeholder='abc@gmail.com' name='email' value={this.state.email} onChange={this.handleChange} required/>
                                                    {this.state.key === 'email' ? <Label basic color='red' pointing='left'>{this.state.Error}</Label> : '' }
                                                    {/* <input path="email" type="email" class="form-control"
                                                        placeholder="Vui lòng nhập email của Quý khách" />
                                                    <errors path="email" /> */}
                                                </div>
                                            </div>
                                            <div className="form-group row mt-3">
                                                <div className="col-md-12">
                                                    <label className="text-black">Số điện thoại<span
                                                        className="text-danger">*</span></label>
                                                    <Form.Input placeholder='0123456789' type="text" maxLength={10} minLength={10} name='phone' value={this.state.phone} onChange={this.handleChange} required/>
                                                    {this.state.key === 'phone' ? <Label basic color='red' pointing='left'>{this.state.Error}</Label> : '' }
                                                    {/* <input path="phone" type="number" class="form-control"
                                                        placeholder="Vui lòng nhập số điện thoại của Quý khách" />
                                                    <errors path="phone" /> */}
                                                </div>
                                            </div>
                                            <div className="form-group row mt-3">
                                                <div className="col-md-12">
                                                    <label className="text-black">Tên tài khoản<span
                                                        className="text-danger">*</span></label>
                                                    <Form.Input placeholder='Username' name='username' value={this.state.username} onChange={this.handleChange} required/>
                                                    {this.state.key === 'username' ? <Label basic color='red' pointing='left'>{this.state.Error}</Label> : '' }
                                                    {/* <input path="username" type="text" class="form-control"
                                                        placeholder="Vui lòng nhập tên tài khoản của Quý khách" />
                                                    <errors path="username" /> */}
                                                </div>
                                            </div>
                                            <div className="form-group row mt-3">
                                                <div className="col-md-12">
                                                    <label className="text-black">Mật khẩu<span
                                                        className="text-danger">*</span></label>
                                                    <Form.Input placeholder='123456' minLength="6" type={this.state.show === false? 'password' : 'text'} name='password' value={this.state.password} onChange={this.handleChange} required/>
                                                    {this.state.key === 'password' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                                                    <Checkbox label='Show password' onChange={(e) => this.handleShowPassword(e)} className="cb"/>
                                                    {/* <input path="password" type="password"
                                                        class="form-control"
                                                        placeholder="Vui lòng nhập password của Quý khách" />
                                                    <errors path="password" /> */}
                                                </div>
                                            </div>
                                            {/* <div class="form-group row">
                                                <div class="col-md-12">
                                                    <label class="text-black">Nhập lại mật khẩu<span
                                                        class="text-danger">*</span></label>
                                                    <input path="confirmPassword" type="password"
                                                        class="form-control"
                                                        placeholder="Vui lòng nhập lại password của Quý khách" />
                                                    <errors path="confirmPassword" />
                                                </div>
                                            </div> */}
                                            <br/>
                                            <div className="form-group row">
                                                <div className="col-lg-12">
                                                    <button type="submit" className="btn btn-success btn-lg btn-block">ĐĂNG KÍ</button>
                                                </div>
                                            </div>
                                        </div>
                                        </Form>
                                </div>
                                {/* <div className="col-md-6 ml-auto">
                                    <label className="text-black">HOẶC ĐĂNG NHẬP BẰNG</label>
                                    <hr/>
                                    <div className="form-group row">
                                        <div className="col-lg-6">
                                            <a href="#" className="btn btn-primary btn-lg btn-block"><i
                                                className="fa fa-facebook-square"></i> FACEBOOK</a>
                                        </div>
                                        <div className="col-lg-6">
                                            <a href="#" className="btn btn-danger btn-lg btn-block"><i
                                                className="fa fa-google-plus-official"></i> GOOGLE +</a>
                                        </div>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>
            </div>
        )
    }
}

export default withRouter(SignUp);