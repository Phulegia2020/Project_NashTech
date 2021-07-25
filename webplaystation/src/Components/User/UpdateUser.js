import React, { Component } from 'react'
import { withRouter } from "react-router";
import { put, get } from '../../Utils/httpHelper';
import { Col, Row, Button, Form, FormGroup, Label, Input } from 'reactstrap';

class UpdateUser extends React.Component {
    state = {
        id: this.props.match.params.id,
        name: "",
        gender: "",
        address: "",
        email: "",
        phone: "",
        account: "",
        //password: "",
        role_id: "",
        roles:[]
    }

    componentDidMount(){
        get(`/users/${this.state.id}`)
        .then((response) => {
            console.log(response.data);
            if (response.status === 200)
            {
                
                // alert(`${id} is found`);
                this.setState({
                    name: response.data.name,
                    gender: response.data.gender,
                    address: response.data.address,
                    email: response.data.email,
                    phone: response.data.phone,
                    account: response.data.account,
                    //password: "",
                    role_id: response.data.role_id,
                })
            }
        });
        get("/roles")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    roles: response.data
                });
                //console.log(this.state.roles);
            }
        })
    }

    componentWillUnmount() {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }

    changeValue(e){
        //this.setState({name: e.target.value})
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleUpdate(event){
        // console.log(this.state.name);
        // console.log(this.state.gender);
        // console.log(this.state.address);
        // console.log(this.state.email);
        // console.log(this.state.phone);
        // console.log(this.state.username);
        // console.log(this.state.password);
        // console.log(this.state.role);
        event.preventDefault();
        //this.props.onUpdate(this.state);
        // password: this.state.password,
        put(`/users/${this.state.id}`, {name: this.state.name, gender:this.state.gender, address: this.state.address, email: this.state.email,
                                        phone: this.state.phone, account: this.state.account, role_id: this.state.role_id})
        .then((response) => {
            if (response.status === 200)
            {
                //console.log(response.data);
                this.props.history.push("/user");
            }
        })
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
        // this.props.onCloseForm();
        // console.log(this.state);
        this.props.history.push("/admin/user");
    }

    render() {
        return (
            <div>
                <FormGroup>
                    <Label for="name">Name</Label>
                    <Input type="text" name="name" id="name" placeholder="Phu Le Gia" onChange={(e) => this.changeValue(e)} value = {this.state.name} required/>
                </FormGroup>
                <FormGroup tag="fieldset" row>
                    <legend className="col-form-label col-sm-2">Gender</legend>
                    <Col md={4}>
                    <FormGroup check>
                        <Label check>
                        <Input type="radio" name="gender" value = "Male" onChange={(e) => this.changeValue(e)} checked={this.state.gender === "Male"}/>{' '}
                        Male
                        </Label>
                    </FormGroup>
                    <FormGroup check>
                        <Label check>
                        <Input type="radio" name="gender" value = "Female" onChange={(e) => this.changeValue(e)} checked={this.state.gender === "Female"} />{' '}
                        Female
                        </Label>
                    </FormGroup>
                    </Col>
                </FormGroup>
                <Row form>
                    <Col md={4}>
                        <FormGroup>
                            <Label for="username">Username</Label>
                            <Input type="text" name="account" id="username" placeholder="Football" onChange={(e) => this.changeValue(e)} value = {this.state.account} required/>
                        </FormGroup>
                    </Col>
                </Row>
                <Row form>
                    <Col md={4}>
                        <FormGroup>
                            <Label for="email">Email</Label>
                            <Input type="email" name="email" id="email" placeholder="abc@gmail.com" onChange={(e) => this.changeValue(e)} value = {this.state.email} required/>
                        </FormGroup>
                    </Col>
                </Row>
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
                    <Input type="select" name="role" id="role" value = {this.state.role_id} onChange={(e) => this.changeValue(e)}>
                        {/* <option value="1">ADMIN</option>
                        <option value="2">PM</option>
                        <option value="3">USER</option> */}
                        {
                            this.state.roles.map((r) => (
                                <option key={r.id} value={r.id}>{r.name}</option>
                            ))
                        }
                    </Input>
                </FormGroup>
                <div className="mb-5">
                    <Button outline color="warning" onClick={this.handleUpdate.bind(this)}>Update</Button>{' '}
                    <Button outline color="danger" onClick={this.handleClear.bind(this)}>Cancel</Button>
                </div>
            </div>
        )
    }
}

export default withRouter(UpdateUser);