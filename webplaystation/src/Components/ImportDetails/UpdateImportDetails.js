import React, { Component } from 'react'
import { get, put } from '../../Utils/httpHelper'
import { withRouter } from "react-router";
import { Col, Row, Button, Form, FormGroup, Label, Input } from 'reactstrap';

class UpdateImportDetails extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            id: this.props.match.params.id,
            quantity: 0,
            price: 0,
            product_id: "",
            import_id: "",
            Error: "",
            key: "",
        }
    }
    
    componentDidMount(){
        get(`/importDetails/${this.state.id}`)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    quantity: response.data.quantity,
                    price: response.data.price,
                    product_id: response.data.product_id,
                    import_id: response.data.imp_id
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
        if (this.state.quantity.trim() <= 0)
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
        put(`/importDetails/${this.state.id}`, {quantity: this.state.quantity, price: this.state.price, product_id: this.state.product_id, import_id: this.state.import_id})
        .then((response) => {
            if (response.status === 200)
            {
                this.props.history.push(`/admin/import/${this.state.import_id}`);
            }
        })
        .catch((error) => {alert('The quantity imported is not more than the quantity ordered')})
    }

    handleClear = () => {
        this.setState({
            quantity: 0,
            price: 0,
        });
        this.props.history.push(`/admin/import/${this.state.import_id}`);
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
                <h3>Update Import Detail</h3>
                <Row form>
                    <Col md={4}>
                        <Form onSubmit={(event) => this.handleUpdate(event)}>
                        <FormGroup>
                            <Label for="quantity">Quantity</Label>
                            <Input type="number" name="quantity" id="quantity" placeholder="100" onChange={(e) => this.changeValue(e)} value = {this.state.quantity} required="required"/>
                            {this.state.key === 'quantity' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                        </FormGroup>
                        <FormGroup>
                            <Label for="quantity">Price</Label>
                            <Input type="number" name="price" id="quantity" placeholder="100" onChange={(e) => this.changeValue(e)} value = {this.state.price} disabled/>
                            {this.state.key === 'price' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                        </FormGroup>
                        <FormGroup className="mb-2">
                            <Label for="product">Product</Label>
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

export default withRouter(UpdateImportDetails);