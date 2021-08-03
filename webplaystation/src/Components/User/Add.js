import React, { Component } from 'react'
import { Col, Row, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { get } from '../../Utils/httpHelper';

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
        }
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

        get("/roles")
        .then((response) => {
            if (response.status === 200)
            {
                //console.log(response.data);
                this.setState({
                    roles: response.data
                });
            }
        })
    }

    changeValue(e){
        //this.setState({name: e.target.value})
        //console.log(e.target.name);
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
        console.log(event.target.username.value.trim());
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
				Error: "Password is at least 6 characters!"
			});
			return;
		}
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
                        {/* {this.state.key === 'fullname' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.blankError}</span> : '' } */}
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
                                <Input type="password" minLength="6" name="password" id="password" placeholder="123456" onChange={(e) => this.changeValue(e)} value = {this.state.password} required/>
                                {this.state.key === 'password' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.blankError}</span> : '' }
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
                        <Input type="text" minLength="10" maxLength="10" name="phone" id="phone" placeholder="0987654321" onChange={(e) => this.changeValue(e)} value = {this.state.phone} required/>
                        {this.state.key === 'phone' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.blankError}</span> : '' }
                    </FormGroup>
                    <FormGroup className="mb-2">
                        <Label for="role">Role</Label>
                        <Input type="select" name="role" id="role" value = {this.state.role} onChange={(e) => this.changeValue(e)}>
                            <option value="ADMIN">ADMIN</option>
                            <option value="PM">PM</option>
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
