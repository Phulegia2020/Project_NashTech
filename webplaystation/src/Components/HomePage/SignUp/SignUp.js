import React, { Component } from 'react'
import { Button, Checkbox, Form, Radio, Label } from 'semantic-ui-react';
import {
	Segment,
	Grid,
} from 'semantic-ui-react'
import {post, postLogin} from "./../../../Utils/httpHelper";
import { withRouter } from "react-router";
import {get} from '../../../Utils/httpHelper';

class SignUp extends Component {
    constructor(props) {
		super(props);
		this.state = { name: "", username: "", password: "", gender: "Male",
        address: "",
        email: "",
        phone: "",
        username: "",
        password: "",
        role: "",
        Error: "",
        key: "",
        users: [],};
    }
    
    componentDidMount(){
        get("/users")
        .then((response) => {
            if (response.status === 200)
            {
                //console.log(response.data);
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

    handleSubmit = (event) => {
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

        post(`/auth/signup`, {name: this.state.name, gender: this.state.gender, address: this.state.address,
            email: this.state.email, phone: this.state.phone, username: this.state.username,
            password: this.state.password, role: this.state.role})
        .then((response) => {
            if (response.status === 200)
            {
                //console.log(response.data);
                alert('Register Successfully!')
                postLogin('/auth/signin', {username: this.state.username, password: this.state.password})
                .then((response) => {
                    if (response.status === 200)
                    {
                        console.log(response.data);
                        localStorage.setItem('accessToken', response.data.accessToken);
                        sessionStorage.setItem('user_id', response.data.id);
				        sessionStorage.setItem('username', response.data.username);
                        if (response.data.roles[0] === "ROLE_USER")
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
                                <Form onSubmit={(event) => this.handleSubmit(event)}>
                                    <Form.Field >
                                        <label>Name</label>
                                        <Form.Input placeholder='Full Name' name='name' value={this.state.name} onChange={this.handleChange} required/>
                                    </Form.Field>
                                    <Form.Group inline>
                                        <label>Gender</label>
                                        <Form.Field
                                            label='Male'
                                            control='input'
                                            type='radio'
                                            name='gender'
                                        />
                                        <Form.Field
                                            label='Female'
                                            control='input'
                                            type='radio'
                                            name='gender'
                                        />
                                    </Form.Group>
                                    <Form.Field inline required>
                                        <label>UserName</label>
                                        <Form.Input placeholder='Username' name='username' value={this.state.username} onChange={this.handleChange} required/>
                                        {this.state.key === 'username' ? <Label basic color='red' pointing='left'>{this.state.Error}</Label> : '' }
                                    </Form.Field>
                                    <Form.Field required>
                                        <label>Password</label>
                                        <Form.Input placeholder='123456' minLength="6" type='password' name='password' value={this.state.password} onChange={this.handleChange} required/>
                                    </Form.Field>
                                    <Form.Field inline>
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
                                        <Form.Input placeholder='0123456789' type="number" name='phone' value={this.state.phone} onChange={this.handleChange} required/>
                                        {this.state.key === 'phone' ? <Label basic color='red' pointing='left'>{this.state.Error}</Label> : '' }
                                    </Form.Field>
                                    <Form.Field>
                                        <Checkbox label='Remember me' />
                                    </Form.Field>
                                    <Button type='submit'>Sign Up</Button>
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