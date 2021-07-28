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
        username: "",
        //password: "",
        role_id: "",
        roles:[],
        Error: "",
        key: "",
        users: [],
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

        get(`/users/${this.state.id}`)
        .then((response) => {
            console.log(response.data);
            if (response.status === 200)
            {
                this.setState({
                    name: response.data.name,
                    gender: response.data.gender,
                    address: response.data.address,
                    email: response.data.email,
                    phone: response.data.phone,
                    username: response.data.account,
                    active_status: response.data.active_status,
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
        if (e.target.name === 'username' || e.target.name === 'phone' || e.target.name === 'email')
        {
            this.setState({
                [e.target.name]: e.target.value.trim()
            });
        }
        else
        {
            this.setState({
                [e.target.name]: e.target.value
            });
        }
    }

    handleUpdate(event){
        event.preventDefault();
        for (let i = 0; i < this.state.users.length; i++)
        {
            if (this.state.users[i].id != this.state.id)
            {
                //console.log(this.state.users[i].id);
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
        put(`/users/${this.state.id}`, {name: this.state.name.trim(), gender:this.state.gender, address: this.state.address.trim(), email: this.state.email.trim(),
                                        phone: this.state.phone, account: this.state.username, active_status: this.state.active_status, role_id: this.state.role_id})
        .then((response) => {
            if (response.status === 200)
            {
                //console.log(response.data);
                this.props.history.push("/admin/user");
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
        // console.log(this.state);
        this.props.history.push("/admin/user");
    }

    render() {
        return (
            <div>
                <h3>Update User</h3>
                <Form onSubmit={(event) => this.handleUpdate(event)}>
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
                            <Input type="text" name="username" id="username" placeholder="Football" onChange={(e) => this.changeValue(e)} value = {this.state.username} disabled/>
                            {this.state.key === 'username' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                        </FormGroup>
                    </Col>
                </Row>
                <Row form>
                    <Col md={4}>
                        <FormGroup>
                            <Label for="email">Email</Label>
                            <Input type="email" name="email" id="email" placeholder="abc@gmail.com" onChange={(e) => this.changeValue(e)} value = {this.state.email} required/>
                            {this.state.key === 'email' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                        </FormGroup>
                    </Col>
                </Row>
                <FormGroup>
                    <Label for="address">Address</Label>
                    <Input type="text" name="address" id="address" placeholder="1234 Main St, HCM City" onChange={(e) => this.changeValue(e)} value = {this.state.address} required/>
                </FormGroup>
                <FormGroup>
                    <Label for="phone">Phone</Label>
                    <Input type="number" minLength={10} maxLength={10} name="phone" id="phone" placeholder="0987654321" onChange={(e) => this.changeValue(e)} value = {this.state.phone} required/>
                    {this.state.key === 'phone' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                </FormGroup>
                <FormGroup className="mb-2">
                    <Label for="role">Role</Label>
                    <Input type="select" name="role_id" id="role" value = {this.state.role_id} onChange={(e) => this.changeValue(e)}>
                        {
                            this.state.roles.map((r) => (
                                <option key={r.id} value={r.id}>{r.name}</option>
                            ))
                        }
                    </Input>
                </FormGroup>
                <div className="mb-5">
                    <Button outline color="warning" >Update</Button>{' '}
                    <Button outline color="danger" onClick={this.handleClear.bind(this)}>Cancel</Button>
                </div>
                </Form>
            </div>
        )
    }
}

export default withRouter(UpdateUser);