import React, { Component } from 'react'
import { get, put } from '../../Utils/httpHelper'
import { withRouter } from "react-router";
import { Col, Row, Button, Form, FormGroup, Label, Input } from 'reactstrap';

class UpdateBillDetails extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            id: this.props.match.params.id,
            quantity: 0,
            bill_id: "",
            product_id: "",
            products: [],
            billdetails: [],
            bill: this.props.billId,
            Error: "",
            key: "",
        }
    }
    
    async componentDidMount(){
        await get(`/billDetails/${this.state.id}`)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    quantity: response.data.quantity,
                    bill_id: response.data.bill_id,
                    product_id: response.data.product_id
                })
            }
        });
        
        get("/products")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    products: response.data
                })
            }
        })
        .catch(error => {console.log(error)})

        get(`/billDetails/bill/${this.state.bill_id}`)
        .then((response) => {
            if (response.status === 200)
            {
                console.log(response.data);
                this.setState({
                    billdetails: response.data
                })
            }
        })
        .catch(error => {})
    }

    changeValue(e){
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleUpdate(event){
        event.preventDefault();
        if (event.target.quantity.value.trim() <= 0)
        {
            this.setState({
                key: 'quantity'
            })
            this.setState({
                Error: "Quantity is not less than 1!"
            });
            return;
        }
        for (let i = 0; i < this.state.billdetails.length; i++)
        {
            if (this.state.billdetails[i].id != this.state.id)
            {
                if (event.target.product_id.value == this.state.billdetails[i].product.id)
                {
                    this.setState({
                        key: 'product'
                    })
                    this.setState({
                        Error: "This product is existed in this Bill!"
                    });
                    return;
                }
            }
        }

        put(`/billDetails/${this.state.id}`, {quantity: this.state.quantity, bill_id: this.state.bill_id, product_id: this.state.product_id})
        .then((response) => {
            if (response.status === 200)
            {
                this.props.history.push(`/admin/bill/${this.state.bill_id}`);
            }
        })
        .catch((error) => {'This product does not have enough quantity!'})
    }

    handleClear = () => {
        this.setState({
            quantity: 0,
        });
        this.props.history.push(`/admin/bill/${this.state.bill_id}`);
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
                <h3>Update Bill Detail</h3>
                <Row form>
                    <Col md={4}>
                        <Form onSubmit={(event) => this.handleUpdate(event)}>
                        <FormGroup>
                            <Label for="quantity">Quantity</Label>
                            <Input type="number" name="quantity" id="quantity" placeholder="100" onChange={(e) => this.changeValue(e)} value = {this.state.quantity} required="required"/>
                            {this.state.key === 'quantity' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                        </FormGroup>
                        
                        <FormGroup className="mb-2">
                            <Label for="product">Product</Label>
                            <Input type="select" name="product_id" id="product" value = {this.state.product_id} onChange={(e) => this.changeValue(e)} required disabled>
                                {
                                    this.state.products.map((p) => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))
                                }
                            </Input>
                            {this.state.key === 'product' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
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

export default withRouter(UpdateBillDetails);