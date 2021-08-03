import React, { Component } from 'react'
import "./../Category/Category.css";
import {del, get, post, put} from "./../../Utils/httpHelper";
import { Link } from 'react-router-dom';
import { withRouter } from "react-router";
import Add from "./Add"
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

class Product extends Component {
    state = {
        products: [],
        isDisplayForm: false,
        pageNumber: 0,
        pageToTal: 0
    }

    componentDidMount(){
        get("/products")
        .then((response) => {
            if (response.status === 200)
            {
                //console.log(response.data);
                this.setState({
                    pageToTal: Math.ceil(response.data.length / 3)
                })
            }
        })
        .catch(error => {console.log(error)})

        get(`/products/page?pageNumber=0&pageSize=3&sortBy=id`)
        .then((response) => {
            this.setState({
                products: response.data,
            });
        })
        .catch(error => console.log(error));
    }

    find(id){
        get(`/products/${id}`)
        .then((response) => {
            if (response.status === 200)
            {
                //console.log(response.data);
            }
        })
    }

    delProduct = (id) =>
    {
        del(`/products/${id}`)
        .then((response) => {
            //console.log(response.data);
            this.setState({products: this.state.products.filter(p => p.id !== id)})
            alert(response.data.message);
        })
        .catch(error => {alert('The product was ordered. Can not delete!')})
    }

    createProduct(newProduct){
        post(`/products`, {name: newProduct.name.trim(), description: newProduct.description.trim(), quantity: newProduct.quantity,
                        price: newProduct.price, totalrating: 0,imageurl: newProduct.imageurl, category_id: newProduct.category_id,
                        supplier_id: newProduct.supplier_id})
        .then((response) => {
            //console.log(response.data);
            window.location.reload();
            this.setState({
                products: [...this.state.products, response.data],
            });
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
        //console.log(data);
        this.createProduct(data);
    }

    onPage(event, pageNumber){
        event.preventDefault();
        this.setState({
            pageNumber: pageNumber
        }, () => console.log(this.state.pageNumber))
        if (pageNumber < 0)
        {
            this.setState({
                pageNumber: 0
            }, () => console.log(this.state.pageNumber))
        }
        if (pageNumber > (this.state.pageToTal-1))
        {
            this.setState({
                pageNumber: (this.state.pageToTal)
            }, () => console.log(this.state.pageNumber));
        }
        
        get(`/products/page?pageNumber=${pageNumber}&pageSize=3&sortBy=id`)
        .then((response) => {
            this.setState({
                products: response.data,
            });
        })
        .catch(error => console.log(error));
    }

    formatCurrency(number) {
        var options = {style: 'currency', currency: 'VND'};
        var numberFormat = new Intl.NumberFormat('en-US', options);

        return numberFormat.format(number);
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
                <button type="button" className="btn btn-primary" onClick={this.onToggleForm}>
                    <FontAwesomeIcon icon={faPlus} className="mr-2"/>{' '}
                    Creat New Product
                </button>
                <table id="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Image</th>
                            {/* <th>Category</th>
                            <th>Supplier</th> */}
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
                                    <td>{this.formatCurrency(p.price)}</td>
                                    <td>
                                        <img src={`data:image/jpeg;base64,${p.imageurl}`} alt="" height="100px"></img>
                                    </td>
                                    {/* <td>{p.category_id}</td>
                                    <td>{p.supplier_id}</td> */}
                                    <td><button onClick={() => this.delProduct(p.id)} className="btn btn-danger">
                                        <FontAwesomeIcon icon={faTrash} className="mr-2"/>{' '}
                                        Del
                                        </button>
                                    </td>
                                    <td>
                                        <Link to={`/admin/product/update/${p.id}`}>
                                            <button className="btn btn-success">
                                            <FontAwesomeIcon icon={faEdit} className="mr-2"/>{' '}
                                                Update
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>

                <Pagination aria-label="Page navigation example">
                    <PaginationItem>
                        <PaginationLink first  onClick={(event) => this.onPage(event, 0)}/>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink previous onClick={(event) => this.onPage(event, this.state.pageNumber - 1)}/>
                    </PaginationItem>
                    {[...Array(this.state.pageToTal)].map((page, i) => 
                        <PaginationItem active={i === this.state.pageNumber} key={i}>
                            <PaginationLink onClick={(event) => this.onPage(event, i)}>
                            {i + 1}
                            </PaginationLink>
                        </PaginationItem>
                    )}
                    <PaginationItem>
                        <PaginationLink next onClick={(event) => this.onPage(event, this.state.pageNumber + 1)}/>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink last onClick={(event) => this.onPage(event, this.state.pageToTal-1)} />
                    </PaginationItem>
                </Pagination>

                <div className="container">
                    <Modal isOpen={this.state.isDisplayForm} toggle={this.onToggleForm}>
                        <ModalHeader toggle={this.onToggleForm}>Create New Product</ModalHeader>
                        <ModalBody>
                            <Add onAdd={this.onAdd} onCloseForm={this.onCloseForm}/>
                        </ModalBody>
                        <ModalFooter>
                        </ModalFooter>
                    </Modal>
                </div>
            </div>
        )
    }
}

export default withRouter(Product);