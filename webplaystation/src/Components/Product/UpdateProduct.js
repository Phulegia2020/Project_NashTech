import React, { Component } from 'react'
import { withRouter } from "react-router";
import { put, get } from '../../Utils/httpHelper';
import { Col, Row, Button, Form, FormGroup, Label, Input } from 'reactstrap';

class UpdateProduct extends Component {
    state = {
        id: this.props.match.params.id,
        name: "",
        description: "",
        quantity: '',
        price: '',
        imageurl: null,
        category_id: "",
        supplier_id: "",
        categories: [],
        suppliers: []
    }

    componentDidMount(){
        get(`/products/${this.state.id}`)
        .then((response) => {
            console.log(response.data);
            if (response.status === 200)
            {
                
                // alert(`${id} is found`);
                this.setState({
                    name: response.data.name,
                    description: response.data.description,
                    quantity: response.data.quantity,
                    price: response.data.price,
                    category_id: response.data.category_id,
                    supplier_id: response.data.supplier_id,
                })
            }
        });
        get("/categories")
        .then((response) => {
            if (response.status === 200)
            {
                console.log(response.data);
                this.setState({
                    categories: response.data
                });
            }
        })

        get("/suppliers")
        .then((response) => {
            if (response.status === 200)
            {
                console.log(response.data);
                this.setState({
                    suppliers: response.data
                });
            }
        })
    }

    changeValue(e){
        //this.setState({name: e.target.value})
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleUpdate(event){
        event.preventDefault();
        put(`/products/${this.state.id}`, {name: this.state.name, description:this.state.description, quantity: this.state.quantity, price: this.state.price,
                                        category_id: this.state.category_id, supplier_id: this.state.supplier_id})
        .then((response) => {
            if (response.status === 200)
            {
                console.log(response.data);
                this.props.history.push("/product");
            }
        })
    }

    handleClear = () => {
        this.setState({
            name: "",
            description: "",
            quantity: "",
            price: "",
        });
        // this.props.onCloseForm();
        // console.log(this.state);
        this.props.history.push("/product");
    }

    render() {
        return (
            <div>
                <FormGroup>
                    <Label for="name">Name</Label>
                    <Input type="text" name="name" id="name" placeholder="PlayStation 4" onChange={(e) => this.changeValue(e)} value = {this.state.name} required="required"/>
                </FormGroup>
                <FormGroup>
                    <Label for="description">Description</Label>
                    <Input type="text" name="description" id="description" placeholder="PlayStation 4 Pro" onChange={(e) => this.changeValue(e)} value = {this.state.description} required="required"/>
                </FormGroup>
                <FormGroup>
                    <Label for="quantity">Quantity</Label>
                    <Input type="number" name="quantity" id="quantity" placeholder="1000" onChange={(e) => this.changeValue(e)} value = {this.state.quantity} required="required"/>
                </FormGroup>
                <FormGroup>
                    <Label for="price">Price</Label>
                    <Input type="number" name="price" id="price" placeholder="1.000.000 VNĐ" onChange={(e) => this.changeValue(e)} value = {this.state.price} required="required"/>
                </FormGroup>
                <FormGroup>
                    <Label for="image">Image</Label>
                    <br></br>
                    <Input type="file" name="image" id="image" required="required"/>
                </FormGroup>
                <FormGroup className="mb-2">
                    <Label for="category">Category</Label>
                    <Input type="select" name="category_id" id="category" value = {this.state.category_id} onChange={(e) => this.changeValue(e)}>
                        {
                            this.state.categories.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))
                        }
                    </Input>
                </FormGroup>
                <FormGroup className="mb-2">
                    <Label for="supplier">Supplier</Label>
                    <Input type="select" name="supplier_id" id="supplier" value = {this.state.supplier_id} onChange={(e) => this.changeValue(e)}>
                        {
                            this.state.suppliers.map((s) => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))
                        }
                    </Input>
                </FormGroup>
                <div className="mb-5">
                    <Button type="submit" outline color="warning" onClick={this.handleUpdate.bind(this)}>Update</Button>{' '}
                    <Button outline color="danger" onClick={this.handleClear.bind(this)}>Cancel</Button>
                </div>
            </div>
        )
    }
}

export default withRouter(UpdateProduct);