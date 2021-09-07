import React, { Component } from 'react'
import { Button, Checkbox, Form, Radio, Label } from 'semantic-ui-react';
import {
	Segment,
	Grid,
} from 'semantic-ui-react'
import {put} from "./../../../Utils/httpHelper";
import { withRouter } from "react-router";
import {get} from '../../../Utils/httpHelper';
import { checkPhoneNumber } from '../../../Utils/Utils';

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
        put(`/users/${localStorage.getItem('user_id')}`, {name: this.state.name.trim(), gender:this.state.gender, address: this.state.address.trim(), email: this.state.email.trim(),
            phone: this.state.phone, account: this.state.username, active_status: this.state.active_status, role_id: this.state.role})
        .then((response) => {
            if (response.status === 200)
            {
                alert('Update Profile Successfully!')
                window.location.href="/WebPlayStation/profile";
            }
        })
        .catch(error => {alert('Update Profile Failed!')});
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
                                <h2>Infomation User</h2>
                                <Form onSubmit={(event) => this.handleSubmit(event)}>
                                    <Form.Field >
                                        <label>Name</label>
                                        <Form.Input placeholder='Full Name' name='name' value={this.state.name} onChange={this.handleChange} required/>
                                    </Form.Field>
                                    <Form.Group inline>
                                        <label>Gender</label>
                                        <Form.Radio
                                            label='Male'
                                            value="Male"
                                            name='gender'
                                            checked={this.state.gender == "Male"}
                                            onChange={this.handleChange}
                                        />
                                        <Form.Radio
                                            label='Female'
                                            value="Female"
                                            name='gender'
                                            checked={this.state.gender == "Female"}
                                            onChange={this.handleChange}
                                        />
                                    </Form.Group>
                                    <Form.Field inline>
                                        <label>Username</label>
                                        <Form.Input placeholder='Username' name='username' value={this.state.username} onChange={this.handleChange} required disabled/>
                                        {this.state.key === 'username' ? <Label basic color='red' pointing='left'>{this.state.Error}</Label> : '' }
                                    </Form.Field>
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
                                        <Form.Input placeholder='0123456789' type="text" name='phone' maxLength={10} minLength={10} value={this.state.phone} onChange={this.handleChange} required/>
                                        {this.state.key === 'phone' ? <Label basic color='red' pointing='left'>{this.state.Error}</Label> : '' }
                                    </Form.Field>
                                    <Button type='submit' disabled={this.state.btndis} color="green">Update</Button>
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