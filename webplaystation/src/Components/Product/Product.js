import React, { Component } from 'react'
import "./../Category/Category.css";
import {del, get, post, put} from "./../../Utils/httpHelper";
import { Link } from 'react-router-dom';
import Add from "./Add"

export default class Product extends Component {
    state = {
        products: [],
        isDisplayForm: false,
    }

    componentDidMount(){
        get("/products")
        .then((response) => {
            if (response.status === 200)
            {
                console.log(response.data);
                this.setState({products: response.data});
            }
        })
        .catch(error => {console.log(error)})
    }

    find(id){
        get(`/products/${id}`)
        .then((response) => {
            if (response.status === 200)
            {
                console.log(response.data);
                // alert(`${id} is found`);
            }
        })
    }

    delProduct = (id) =>
    {
        del(`/products/${id}`)
        .then((response) => {
            console.log(response.data);
            this.setState({products: this.state.products.filter(u => u.id !== id)})
            alert(response.data.message);
        })
        .catch(error => {console.log(error)})
    }

    createProduct(newProduct){
        console.log(newProduct.price);
        post(`/products`, {name: newProduct.name, description: newProduct.description, quantity: newProduct.quantity,
                        price: newProduct.price, imageurl: newProduct.imageurl, category_id: newProduct.category_id,
                        supplier_id: newProduct.supplier_id})
        .then((response) => {
            console.log(response.data);
            this.setState({
                products: [...this.state.products, response.data],
            });
            console.log(newProduct.price);
        });
    }

    onToggleForm = () => {
        this.setState({
            isDisplayForm: !this.state.isDisplayForm
        });
    }

    onCloseForm = () => {
        this.setState({
            isDisplayForm: false,
        });
    }

    onAdd = (data) => {
        console.log(data);
        this.createProduct(data);
    }

    render() {
        return (
            <div>
                <button type="button" className="btn btn-primary" onClick={this.onToggleForm}>
                    <span className="fa fa-plus mr-5"></span>
                    Creat New Product
                </button>
                <table id="table">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Image</th>
                            <th>Category</th>
                            <th>Supplier</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.products.map((p) => (
                                <tr key={p.id}>
                                    <td>{p.id}</td>
                                    <td>{p.name}</td>
                                    <td>{p.description}</td>
                                    <td>{p.quantity}</td>
                                    <td>{p.price}</td>
                                    {/* <td>{p.imageurl}</td> */}
                                    <td>
                                        <img src={`data:image/jpeg;base64,${p.imageurl}`} alt="" height="100px"></img>
                                    </td>
                                    <td>{p.category_id}</td>
                                    <td>{p.supplier_id}</td>
                                    <td><button onClick={() => this.delProduct(p.id)}>Del</button></td>
                                    <td>
                                        <Link to={`product/update/${p.id}`}>
                                            <button className="btn btn-success">
                                                Update
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                <div className="container">
                    {this.state.isDisplayForm ? <Add onAdd={this.onAdd} onCloseForm={this.onCloseForm}/> : ''}
                </div>
            </div>
        )
    }
}
