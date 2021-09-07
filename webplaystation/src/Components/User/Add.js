import React, { Component } from 'react'
import { Col, Row, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { get } from '../../Utils/httpHelper';
import { checkPhoneNumber } from '../../Utils/Utils';
import { Checkbox} from 'semantic-ui-react';

export default class Add extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            fullname: "",
            gender: "Male",
            address: "",
            email: "",
            phone: "",
            username: "",
            password: "",
            role: "",
            roles: [],
            blankError: "",
            key: "",
            users: [],
            show: false
        }
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

        get("/roles")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    roles: response.data
                });
            }
        })
    }

    changeValue(e){
        if (e.target.name === 'username' || e.target.name === 'phone' || e.target.name === 'email')
        {
            this.setState({
                [e.target.name]: e.target.value.trim()
            });
        }
        else{
            this.setState({
                [e.target.name]: e.target.value
            });
        }
    }

    async handleCreate(event){
        event.preventDefault();
        await this.setState({
            role: event.target.role.value
        })
        for (let i = 0; i < this.state.users.length; i++)
        {
            if (this.state.users[i].account === event.target.username.value.trim())
            {
                this.setState({
                    key: 'username'
                })
                this.setState({
                    blankError: "This username is existed!"
                });
                return;
            }
            if (this.state.users[i].email === event.target.email.value.trim())
            {
                this.setState({
                    key: 'email'
                })
                this.setState({
                    blankError: "This email is existed!"
                });
                return;
            }
            if (this.state.users[i].phone === event.target.phone.value.trim())
            {
                this.setState({
                    key: 'phone'
                })
                this.setState({
                    blankError: "This phone number is existed!"
                });
                return;
            }
        }
        if (event.target.password.value.length < 6)
		{
			this.setState({
				key: 'password'
			})
			this.setState({
				blankError: "Password is at least 6 characters!"
			});
			return;
        }
        if (event.target.phone.value.trim().length !== 10)
		{
			this.setState({
				key: 'phone'
			})
			this.setState({
				blankError: "Phone must have 10 numbers!"
			});
			return;
        }
        if (event.target.phone.value[0] != 0)
		{
			this.setState({
				key: 'phone'
			})
			this.setState({
				blankError: "Phone must start with number 0!"
			});
			return;
        }
        this.setState({
            key: '',
            blankError: ''
        })
        this.props.onAdd(this.state);
    }

    handleClear = () => {
        this.setState({
            name: "",
            gender: "",
            address: "",
            email: "",
            phone: "",
            username: "",
            password: "",
            role: ""
        });
        this.props.onCloseForm();
    }

    handleShowPassword(e)
	{
		e.preventDefault();
		this.setState({
			show: !this.state.show
		})
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
                <Form onSubmit={(event) => this.handleCreate(event)}>
                    <FormGroup>
                        <Label for="name">Name</Label>
                        <Input type="text" name="fullname" id="name" placeholder="Phu Le Gia" onChange={(e) => this.changeValue(e)} value = {this.state.fullname} required/>
                    </FormGroup>
                    <FormGroup tag="fieldset" row>
                        <legend className="col-form-label col-sm-2">Gender</legend>
                        <Form inline>
                            <FormGroup check>
                                <Label check>
                                <Input type="radio" name="gender" defaultChecked value = "Male" onChange={(e) => this.changeValue(e)}/>{' '}
                                Male
                                </Label>
                            </FormGroup>

                            <FormGroup check>
                                <Label check>
                                <Input type="radio" name="gender" value = "Female" onChange={(e) => this.changeValue(e)} />{' '}
                                Female
                                </Label>
                            </FormGroup>
                        </Form>
                    </FormGroup>
                    <Row form>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="username">Username</Label>
                                <Input type="text" name="username" id="username" placeholder="Football" onChange={(e) => this.changeValue(e)} value = {this.state.username} required/>
                                {this.state.key === 'username' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.blankError}</span> : '' }
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="password">Password</Label>
                                <Input type={this.state.show === false? 'password' : 'text'} minLength="6" name="password" id="password" placeholder="******" onChange={(e) => this.changeValue(e)} value = {this.state.password} required/>
                                {this.state.key === 'password' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.blankError}</span> : '' }
                                <Checkbox label='Show password' onChange={(e) => this.handleShowPassword(e)}/>
                            </FormGroup>
                        </Col>
                    </Row>
                    <FormGroup>
                        <Label for="email">Email</Label>
                        <Input type="email" name="email" id="email" placeholder="abc@gmail.com" onChange={(e) => this.changeValue(e)} value = {this.state.email} required/>
                        {this.state.key === 'email' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.blankError}</span> : '' }
                    </FormGroup>
                    <FormGroup>
                        <Label for="address">Address</Label>
                        <Input type="text" name="address" id="address" placeholder="1234 Main St, HCM City" onChange={(e) => this.changeValue(e)} value = {this.state.address} required/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="phone">Phone</Label>
                        <Input type="number" minLength="10" maxLength="10" name="phone" id="phone" placeholder="0987654321" onChange={(e) => this.changeValue(e)} value = {this.state.phone} required/>
                        {this.state.key === 'phone' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.blankError}</span> : '' }
                    </FormGroup>
                    <FormGroup className="mb-2">
                        <Label for="role">Role</Label>
                        <Input type="select" name="role" id="role" onChange={(e) => this.changeValue(e)} required>
                            <option defaultValue="ADMIN">ADMIN</option>
                            <option value="STAFF">STAFF</option>
                            <option value="USER">USER</option>
                        </Input>
                    </FormGroup>
                    <div className="mb-5">
                        <Button type="submit" outline color="warning" >Add</Button>{' '}
                        <Button outline color="danger" onClick={this.handleClear.bind(this)}>Cancel</Button>
                    </div>
                    </Form>
            </div>
        )
    }
}
