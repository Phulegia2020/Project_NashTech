import React, { Component } from 'react'
import { withRouter } from "react-router";
import { put, get } from '../../Utils/httpHelper';
import { Col, Row, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import "../Category/Category.css";

class UpdateProduct extends Component {
    state = {
        id: this.props.match.params.id,
        name: "",
        description: "",
        quantity: '',
        price: '',
        totalrating: 0,
        imageurl: null,
        category_id: "",
        supplier_id: "",
        status:"",
        categories: [],
        suppliers: [],
        base64: "",
        products: [],
        Error: "",
        key: "",
    }

    componentDidMount(){
        get("/products")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({products: response.data});
            }
        })
        .catch(error => {console.log(error)})

        get(`/products/${this.state.id}`)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    name: response.data.name,
                    description: response.data.description,
                    quantity: response.data.quantity,
                    price: response.data.price,
                    totalrating: response.data.totalrating,
                    imageurl: response.data.imageurl,
                    category_id: response.data.category.id,
                    supplier_id: response.data.supplier.id,
                    status: response.data.status
                })
            }
        });
        get("/categories")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    categories: response.data
                });
            }
        })

        get("/suppliers")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    suppliers: response.data
                });
            }
        })
    }

    convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
            resolve(fileReader.result);
            };
            fileReader.onerror = (error) => {
            reject(error);
            };
        });
    };

    uploadImage = async (e) => {
        const file = e.target.files[0];
        const base64 = await this.convertBase64(file);
        this.setState({
            base64: base64
        });
        const byteArr = this.state.base64.split(",");
        let photo = byteArr[1];
        this.setState({
            imageurl: photo
        });
    };
    
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

        for (let i = 0; i < this.state.products.length; i++)
        {
            if (this.state.products[i].id != this.state.id)
            {
                if (this.state.products[i].name === event.target.name.value.trim())
                {
                    this.setState({
                        key: 'name'
                    })
                    this.setState({
                        Error: "This name is existed!"
                    });
                    return;
                }
            }
        }
        put(`/products/${this.state.id}`, {name: this.state.name.trim(), description:this.state.description.trim(), quantity: this.state.quantity, price: this.state.price,
                                           totalrating:this.state.totalrating ,imageurl: this.state.imageurl, category_id: this.state.category_id, supplier_id: this.state.supplier_id,
                                           status: this.state.status})
        .then((response) => {
            if (response.status === 200)
            {
                this.props.history.push("/admin/product");
            }
        })
        .catch((error) => {})
    }

    handleClear = () => {
        this.setState({
            name: "",
            description: "",
            quantity: "",
            price: "",
        });
        this.props.history.push("/admin/product");
    }

    componentWillUnmount() {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }

    render() {
        return (
            <div className="update-form-product">
                <h3>Update Product</h3>
                {/* <Row form>
                    <Col md={4}> */}
                        <Form onSubmit={(event) => this.handleUpdate(event)}>
                        <FormGroup>
                            <Label htmlFor="name">Name</Label>
                            <Input type="text" name="name" id="name" placeholder="PlayStation 4" onChange={(e) => this.changeValue(e)} value = {this.state.name} required="required" disabled={this.state.status === 'Stop'}/>
                            {this.state.key === 'name' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="description">Description</Label><br></br>
                            <textarea style={{resize: 'none', width: '100%'}} rows="3" name="description" id="description" placeholder="PlayStation 4 Pro" onChange={(e) => this.changeValue(e)} value = {this.state.description} required="required" disabled={this.state.status === 'Stop'}></textarea>
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="quantity">Quantity</Label>
                            <Input type="number" name="quantity" id="quantity" placeholder="1000" onChange={(e) => this.changeValue(e)} value = {this.state.quantity} required="required" disabled={this.state.status === 'Stop'}/>
                            {this.state.key === 'quantity' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="price">Price</Label>
                            <Input type="number" name="price" id="price" placeholder="1.000.000 VNĐ" onChange={(e) => this.changeValue(e)} value = {this.state.price} required="required" disabled={this.state.status === 'Stop'}/>
                            {this.state.key === 'price' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="image">Image</Label>
                            <br></br>
                            <Input type="file" name="image" id="image" accept=".jpeg, .png, .jpg" onChange={(e) => {this.uploadImage(e)}} disabled={this.state.status === 'Stop'}/>
                            <br></br>
                            <img src={`data:image/jpeg;base64,${this.state.imageurl}`} alt="" height="150px"></img>
                        </FormGroup>
                        <FormGroup className="mb-2">
                            <Label htmlFor="category">Category</Label>
                            <Input type="select" name="category_id" id="category" value = {this.state.category_id} onChange={(e) => this.changeValue(e)} disabled={this.state.status === 'Stop'}>
                                {
                                    this.state.categories.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))
                                }
                            </Input>
                        </FormGroup>
                        <FormGroup className="mb-2">
                            <Label htmlFor="supplier">Supplier</Label>
                            <Input type="select" name="supplier_id" id="supplier" value = {this.state.supplier_id} onChange={(e) => this.changeValue(e)} disabled={this.state.status === 'Stop'}>
                                {
                                    this.state.suppliers.map((s) => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))
                                }
                            </Input>
                        </FormGroup>
                        <div className="mt-3">
                            <Button type="submit" outline color="warning" >Update</Button>{' '}
                            <Button outline color="danger" onClick={this.handleClear.bind(this)}>Cancel</Button>
                        </div>
                        </Form>
                    {/* </Col>
                </Row> */}
            </div>
        )
    }
}

export default withRouter(UpdateProduct);