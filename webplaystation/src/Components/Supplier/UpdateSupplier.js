import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Col, Row, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { checkPhoneNumber } from '../../Utils/Utils';
import { get, put } from '../../Utils/httpHelper';
import "../Category/Category.css";

class UpdateSupplier extends Component {
    state = {
        id: this.props.match.params.id,
        name: "",
        address: "",
        phone: "",
        status: "",
        Error: "",
        key: "",
        suppliers: []
    }

    componentDidMount(){
        get("/suppliers")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({suppliers: response.data});
            }
        })
        .catch(error => {console.log(error)})

        get(`/suppliers/${this.state.id}`)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    name: response.data.name,
                    address: response.data.address,
                    phone: response.data.phone,
                    status: response.data.status
                })
            }
        })
    }

    changeValue(e){
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleUpdate(event){
        event.preventDefault();

        for (let i = 0; i < this.state.suppliers.length; i++)
        {
            if (this.state.suppliers[i].id != this.state.id)
            {
                if (this.state.suppliers[i].name === event.target.name.value.trim())
                {
                    this.setState({
                        key: 'supplier'
                    })
                    this.setState({
                        Error: "This supplier is existed in list management at store!"
                    });
                    return;
                }
                if (this.state.suppliers[i].address === event.target.address.value.trim())
            {
                this.setState({
                    key: 'address'
                })
                this.setState({
                    Error: "This address is existed in list management at store!"
                });
                return;
            }
                if (this.state.suppliers[i].phone === event.target.phone.value.trim())
                {
                    this.setState({
                        key: 'phone'
                    })
                    this.setState({
                        Error: "This phone is existed!"
                    });
                    return;
                }
            }
        }
        if (!checkPhoneNumber(event.target.phone.value.trim()))
        {
            this.setState({
                key: 'phone'
            })
            this.setState({
                Error: "Phone must be numbers and start with 0!"
            });
            return;
        }
        put(`/suppliers/${this.state.id}`, {name: this.state.name.trim(), address: this.state.address.trim(), phone: this.state.phone.trim(), status: this.state.status})
        .then((response) => {
            if (response.status === 200)
            {
                window.location.href="/admin/supplier";
            }
        })
        .catch((error) => {console.log(error)});
    }

    handleClear = () => {
        this.setState({
            name: '',
            address: '',
            phone: '',
        });
        this.props.history.push("/admin/supplier");
    }

    componentWillUnmount() {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }

    render() {
        return (
            <div className="update-form">
                <h3>Update Supplier</h3>
                {/* <Row form>
                    <Col md={4}> */}
                        <Form onSubmit={(event) => this.handleUpdate(event)}>
                            <FormGroup>
                                <Label htmlFor="name">Name</Label>
                                <Input type="text" name="name" id="name" placeholder="PS5" onChange={(e) => this.changeValue(e)} value = {this.state.name} required="required" disabled={this.state.status === 'Disconnected'}/>
                                {this.state.key === 'supplier' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="address">Address</Label>
                                <Input type="text" name="address" id="address" placeholder="1 Street, 2 Ward, 3 District, Ho Chi Minh City" onChange={(e) => this.changeValue(e)} value = {this.state.address} required="required" disabled={this.state.status === 'Disconnected'}/>
                                {this.state.key === 'address' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="phone">Phone</Label>
                                <Input type="text" name="phone" id="phone" minLength="10" maxLength="10" placeholder="0123456789" onChange={(e) => this.changeValue(e)} value = {this.state.phone} required="required" disabled={this.state.status === 'Disconnected'}/>
                                {this.state.key === 'phone' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                            </FormGroup>
                            <div className="mt-3">
                                <Button type="submit" outline color="warning">Udpate</Button>{' '}
                                <Button outline color="danger" onClick={this.handleClear.bind(this)}>Cancel</Button>
                            </div>
                        </Form>
                    {/* </Col>
                </Row> */}
            </div>
        )
    }
}
export default withRouter(UpdateSupplier);