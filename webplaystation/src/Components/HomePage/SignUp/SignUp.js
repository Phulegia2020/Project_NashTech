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
                    Error: "This email is existed!"
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
            <div>
                <Segment style={{ padding: '8em 0em' }} vertical>
                    
                    <Grid container stackable verticalAlign='middle'>
                        
                        <Grid.Row>
                            <Grid.Column width={8}>
                                <h2>Register</h2>
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
                                    <Form.Field inline>
                                        <label>Phone</label>
                                        <Form.Input placeholder='0123456789' type="text" maxLength={10} minLength={10} name='phone' value={this.state.phone} onChange={this.handleChange} required/>
                                        {this.state.key === 'phone' ? <Label basic color='red' pointing='left'>{this.state.Error}</Label> : '' }
                                    </Form.Field>
                                    <Button type='submit' color='google plus'>Sign Up</Button>
                                </Form>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
            </div>
        )
    }
}

export default withRouter(SignUp);