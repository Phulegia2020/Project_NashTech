import React, { Component } from 'react'
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { get } from '../../Utils/httpHelper';

export default class Add extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            quantity: 0,
            price: 0,
            placeorder_id: this.props.placeorder,
            product_id: "",
            products: [],
            placeorderdetails: this.props.placeorderDet,
            Error: "",
            key: "",
        }
    }
    
    componentDidMount(){
        get("/products/onSale")
        .then((response) => {
            if (response.status === 200)
            {
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

    async handleCreate(event){
        event.preventDefault();
        await this.setState({
            product_id: event.target.product_id.value,
        })
        if (event.target.quantity.value.trim() <= 0)
        {
            this.setState({
                key: 'quantity'
            })
            this.setState({
                Error: "Số lượng không nhỏ hơn 1!"
            });
            return;
        }
        if (event.target.price.value.trim() <= 0)
        {
            this.setState({
                key: 'price'
            })
            this.setState({
                Error: "Giá không nhỏ hơn 1!"
            });
            return;
        }
        for (let i = 0; i < this.state.placeorderdetails.length; i++)
        {
            if (event.target.product_id.value === this.state.placeorderdetails[i].product_id)
            {
                this.setState({
                    key: 'product'
                })
                this.setState({
                    Error: "Máy này đã có trong phiếu đặt!"
                });
                return;
            }
        }
        this.setState({
            Error: "",
            // quantity: 0,
            // price: 0,
        })
        this.props.onAdd(this.state);
    }

    handleClear = () => {
        this.setState({
            quantity: 0,
            price: 0,
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
                    <Label htmlFor="quantity">Số Lượng</Label>
                    <Input type="number" name="quantity" id="quantity" placeholder="100" onChange={(e) => this.changeValue(e)} value = {this.state.quantity} required="required"/>
                    {this.state.key === 'quantity' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="price">Giá</Label>
                    <Input type="number" name="price" id="price" placeholder="1.000.000 VND" onChange={(e) => this.changeValue(e)} value = {this.state.price} required="required"/>
                    {this.state.key === 'price' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                </FormGroup>
                
                <FormGroup className="mb-2">
                    <Label htmlFor="product">Máy</Label>
                    <Input type="select" name="product_id" id="product" onChange={(e) => this.changeValue(e)} multiple required>
                        {
                            this.state.products.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))
                        }
                    </Input>
                    {this.state.key === 'product' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                </FormGroup>
                <div className="mb-5">
                    <Button type="submit" outline color="warning" >Tạo</Button>{' '}
                    <Button outline color="danger" onClick={this.handleClear.bind(this)}>Hủy</Button>
                </div>
                </Form>
            </div>
        )
    }
}
