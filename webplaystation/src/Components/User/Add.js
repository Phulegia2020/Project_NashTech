import React, { Component } from 'react'
import { Col, Row, Button, Form, FormGroup, Label, Input } from 'reactstrap';

export default class Add extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            name: "",
            gender: "",
            address: "",
            email: "",
            phone: "",
            username: "",
            password: "",
            role: ""
        }
    }
    

    changeValue(e){
        //this.setState({name: e.target.value})
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleCreate(event){
        event.preventDefault();
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

    render() {
        return (
            <div>
                    <FormGroup>
                        <Label for="name">Name</Label>
                        <Input type="text" name="name" id="name" placeholder="Phu Le Gia" onChange={(e) => this.changeValue(e)} value = {this.state.name} required="required"/>
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
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="password">Password</Label>
                                <Input type="password" name="password" id="password" placeholder="123456" onChange={(e) => this.changeValue(e)} value = {this.state.password} required/>
                            </FormGroup>
                        </Col>
                    </Row>
                    <FormGroup>
                        <Label for="email">Email</Label>
                        <Input type="email" name="email" id="email" placeholder="abc@gmail.com" onChange={(e) => this.changeValue(e)} value = {this.state.email} required/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="address">Address</Label>
                        <Input type="text" name="address" id="address" placeholder="1234 Main St, HCM City" onChange={(e) => this.changeValue(e)} value = {this.state.address} required/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="phone">Phone</Label>
                        <Input type="text" name="phone" id="phone" placeholder="0987654321" onChange={(e) => this.changeValue(e)} value = {this.state.phone} required/>
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
                        <Button outline color="warning" onClick={this.handleCreate.bind(this)}>Add</Button>{' '}
                        <Button outline color="danger" onClick={this.handleClear.bind(this)}>Cancel</Button>
                    </div>
                    </div>
            
        )
    }
}
