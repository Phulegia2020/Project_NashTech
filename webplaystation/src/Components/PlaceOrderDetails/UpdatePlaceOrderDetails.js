import React, { Component } from 'react'
import { get, put } from '../../Utils/httpHelper'
import { withRouter } from "react-router";
import { Col, Row, Button, Form, FormGroup, Label, Input } from 'reactstrap';

class UpdatePlaceOrderDetails extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            id: this.props.match.params.id,
            quantity: 0,
            price: 0,
            product_id: "",
            placeorder_id: "",
            Error: "",
            key: "",
        }
    }
    
    componentDidMount(){
        get(`/placeorderDetails/${this.state.id}`)
        .then((response) => {
            console.log(response.data);
            if (response.status === 200)
            {
                this.setState({
                    quantity: response.data.quantity,
                    price: response.data.price,
                    product_id: response.data.product_id,
                    placeorder_id: response.data.placeorder_id
                })
            }
        });
    }

    changeValue(e){
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleUpdate(event){
        event.preventDefault();
        if (this.state.quantity <= 0)
        {
            this.setState({
                key: 'quantity'
            })
            this.setState({
                Error: "Quantity is not less than 1!"
            });
            return;
        }
        if (event.target.price.value.trim() <= 0)
        {
            this.setState({
                key: 'price'
            })
            this.setState({
                Error: "Price is not less than 1!"
            });
            return;
        }
        put(`/placeorderDetails/${this.state.id}`, {quantity: this.state.quantity, price: this.state.price, product_id: this.state.product_id, placeorder_id: this.state.placeorder_id})
        .then((response) => {
            if (response.status === 200)
            {
                this.props.history.push(`/admin/placeorder/${this.state.placeorder_id}`);
            }
        })
        .catch((error) => alert('The Place Order had already this product'));
    }

    handleClear = () => {
        this.setState({
            quantity: 0,
            price: 0,
        });
        this.props.history.push(`/admin/placeorder/${this.state.placeorder_id}`);
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
                <h3>Update Place Order Detail</h3>
                <Row form>
                    <Col md={4}>
                        <Form onSubmit={(event) => this.handleUpdate(event)}>
                        <FormGroup>
                            <Label htmlFor="quantity">Quantity</Label>
                            <Input type="number" name="quantity" id="quantity" placeholder="100" onChange={(e) => this.changeValue(e)} value = {this.state.quantity} required="required"/>
                            {this.state.key === 'quantity' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="quantity">Price</Label>
                            <Input type="number" name="price" id="quantity" placeholder="100" onChange={(e) => this.changeValue(e)} value = {this.state.price} required="required"/>
                            {this.state.key === 'price' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                        </FormGroup>
                        <FormGroup className="mb-2">
                            <Label htmlFor="product">Product</Label>
                            <Input type="text" name="product_id" id="product" value = {this.state.product_id} onChange={(e) => this.changeValue(e)} disabled />
                        </FormGroup>
                        <div className="mb-5">
                            <Button type="submit" outline color="warning" >Update</Button>{' '}
                            <Button outline color="danger" onClick={this.handleClear.bind(this)}>Cancel</Button>
                        </div>
                        </Form>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default withRouter(UpdatePlaceOrderDetails);