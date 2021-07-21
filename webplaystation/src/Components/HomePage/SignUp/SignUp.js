import React, { Component } from 'react'
import { Button, Checkbox, Form } from 'semantic-ui-react';
import {
	Segment,
	Grid,
} from 'semantic-ui-react'
import {post} from "./../../../Utils/httpHelper";
import { withRouter } from "react-router";

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
        activeItem:'logined' };
    }
    
    handleChange = (e, { name, value }) => {
		this.setState({ [name]: value });
    }

    handleSubmit = () => {
        post(`/auth/signup`, {name: this.state.name, gender: this.state.gender, address: this.state.address,
            email: this.state.email, phone: this.state.phone, username: this.state.username,
            password: this.state.password, role: this.state.role})
        .then((response) => {
            if (response.status === 200)
            {
                console.log(response.data);
                alert('Register Successfully!')
                this.props.history.push("/");
            }
        })
        .catch(error => console.log(error));
    }
    
    render() {
        return (
            <div>
                <Segment style={{ padding: '8em 0em' }} vertical>
                    <Grid container stackable verticalAlign='middle'>
                        <Grid.Row>
                            <Grid.Column width={8}>
                                <Form onSubmit={this.handleSubmit}>
                                    <Form.Field required>
                                        <label>Name</label>
                                        <Form.Input placeholder='Full Name' name='name' value={this.state.name} onChange={this.handleChange} />
                                    </Form.Field>
                                    <Form.Group inline>
                                        <label>Gender</label>
                                        <Form.Radio
                                            label='Male'
                                            value='Male'
                                            defaultChecked
                                            onChange={this.handleChange}
                                        />
                                        <Form.Radio
                                            label='Female'
                                            value='Female'
                                            onChange={this.handleChange}
                                        />
                                    </Form.Group>
                                    <Form.Field required>
                                        <label>UserName</label>
                                        <Form.Input placeholder='Username' name='username' value={this.state.username} onChange={this.handleChange} />
                                    </Form.Field>
                                    <Form.Field required>
                                        <label>Password</label>
                                        <Form.Input placeholder='123456' type='password' name='password' value={this.state.password} onChange={this.handleChange} />
                                    </Form.Field>
                                    <Form.Field required>
                                        <label>Email</label>
                                        <Form.Input placeholder='abc@gmail.com' name='email' value={this.state.email} onChange={this.handleChange} />
                                    </Form.Field>
                                    <Form.Field required>
                                        <label>Address</label>
                                        <Form.Input placeholder='123 Main st, Ward, District, Ho Chi Minh City' name='address' value={this.state.address} onChange={this.handleChange} />
                                    </Form.Field>
                                    <Form.Field required>
                                        <label>Phone</label>
                                        <Form.Input placeholder='0123456789' type='number' name='address' value={this.state.phone} onChange={this.handleChange} />
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