import React, { Component } from 'react';
import { Col, Row, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { get } from '../../Utils/httpHelper';

export default class Add extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            quantity: 0,
            bill_id: this.props.bill,
            product_id: "",
            products: [],
            billdetails: this.props.billDet,
            Error: "",
            key: "",
        }
    }
    
    componentDidMount(){
        get("/products")
        .then((response) => {
            if (response.status === 200)
            {
                //console.log(response.data);
                this.setState({
                    products: response.data
                })
            }
        })
        .catch(error => {console.log(error)})
    }

    changeValue(e){
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleCreate(event){
        event.preventDefault();
        for (let i = 0; i < this.state.billdetails.length; i++)
        {
            if (event.target.product_id.value === this.state.billdetails[i].product_id)
            {
                this.setState({
                    key: 'product'
                })
                this.setState({
                    Error: "This product is existed in this Bill. Update instead of Creating!"
                });
                return;
            }
        }
        this.props.onAdd(this.state);
    }

    handleClear = () => {
        this.setState({
            quantity: 0,
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
                    <Label for="quantity">Quantity</Label>
                    <Input type="number" name="quantity" id="quantity" placeholder="100" onChange={(e) => this.changeValue(e)} value = {this.state.quantity} required="required"/>
                </FormGroup>
                
                <FormGroup className="mb-2">
                    <Label for="product">Product</Label>
                    <Input type="select" name="product_id" id="product" value = {this.state.product_id} onChange={(e) => this.changeValue(e)} required>
                        {
                            this.state.products.map((p) => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))
                        }
                    </Input>
                    {this.state.key === 'product' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
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
