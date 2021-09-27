import React, { Component } from 'react'
import "./../Category/Category.css";
import {del, get, post} from "./../../Utils/httpHelper";
import {formatQuantity, formatCurrency} from "./../../Utils/Utils";
import { Link } from 'react-router-dom';
import { withRouter } from "react-router";
import Add from "./Add"
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Input, Breadcrumb } from 'semantic-ui-react';

class Product extends Component {
    state = {
        products: [],
        isDisplayForm: false,
        isDisplayFormDel: false,
        pageNumber: 0,
        pageToTal: 0,
        id: "",
        search: ""
    }

    componentDidMount(){
        get("/products/onSale")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    pageToTal: Math.ceil(response.data.length / 3)
                })
            }
        })
        .catch(error => {console.log(error)})

        get(`/products/pageOnSale?pageNumber=0&pageSize=3&sortBy=id`)
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
            }
        })
    }

    delProduct = (e, id) =>
    {
        e.preventDefault();
        del(`/products/${id}`)
        .then((response) => {
            this.setState({products: this.state.products.filter(p => p.id !== id)})
            this.setState({isDisplayFormDel: false})
        })
        .catch(error => {alert('The product was ordered. Can not delete!')})
    }

    createProduct(newProduct){
        post(`/products`, {name: newProduct.name.trim(), description: newProduct.description.trim(), quantity: newProduct.quantity,
                        price: newProduct.price, totalrating: 0,imageurl: newProduct.imageurl, category_id: newProduct.category_id,
                        supplier_id: newProduct.supplier_id})
        .then((response) => {
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

    onToggleFormDel = (e, id) => {
        e.preventDefault()
        this.setState({
            isDisplayFormDel: !this.state.isDisplayFormDel,
            id: id
        });
    }

    onCloseFormDel = (e) => {
        e.preventDefault()
        this.setState({
            isDisplayFormDel: false,
        });
    }

    onAdd = (data) => {
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

        if (this.state.search === '')
        {
            get(`/products/pageOnSale?pageNumber=${pageNumber}&pageSize=3&sortBy=id`)
            .then((response) => {
                this.setState({
                    products: response.data,
                });
            })
            .catch(error => console.log(error));
        }
        else
        {
            get(`/products/namePage?name=${this.state.search}&pageNumber=${pageNumber}&pageSize=3&sortBy=id`)
            .then((response) => {
                if (response.status === 200)
                {
                    this.setState({products: response.data});
                }
            })
            .catch(error => {console.log(error)})
        }
    }

    async handleSearch(e){
        e.preventDefault()
        await this.setState({
            search: e.target.value
        })
        if (this.state.search === '')
        {
            get("/products/onSale")
            .then((response) => {
                if (response.status === 200)
                {
                    this.setState({
                        pageToTal: Math.ceil(response.data.length / 3)
                    })
                }
            })
            .catch(error => {console.log(error)})

            get(`/products/pageOnSale?pageNumber=0&pageSize=3&sortBy=id`)
            .then((response) => {
                this.setState({
                    products: response.data,
                });
            })
            .catch(error => console.log(error));
        }
        else
        {
            get(`/products/name?name=${this.state.search}`)
            .then((response) => {
                if (response.status === 200)
                {
                    this.setState({
                        pageToTal: Math.ceil(response.data.length / 3)
                    })
                }
            })
            .catch(error => {console.log(error)})
            
            get(`/products/namePage?name=${this.state.search}&pageNumber=0&pageSize=3&sortBy=id`)
            .then((response) => {
                if (response.status === 200)
                {
                    this.setState({products: response.data});
                }
            })
            .catch(error => {console.log(error)})
        }
    }

    componentWillUnmount() {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }

    render() {
        const sections = [
            { key: 'Quản Lý', content: 'Quản Lý', link: false },
            { key: 'Sản Phẩm', content: 'Sản Phẩm', active: true }
          ]
        return (
            <div>
                <Modal
                    isOpen={this.state.isDisplayFormDel}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    toggle={this.onToggleFormDel}
                    >
                    <ModalHeader>
                        Delete
                    </ModalHeader>
                    <ModalBody>
                        <p>
                        Do you want to stop selling this product?
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={(e) => this.delProduct(e, this.state.id)} className="btn-danger">Delete</Button>
                        <Button onClick={(e) => this.onCloseFormDel(e)}>Close</Button>
                    </ModalFooter>
                </Modal>
                <Breadcrumb icon='right angle' sections={sections} size='large'/>
                <br/>
                <button type="button" className="btn btn-primary" onClick={this.onToggleForm} style={{marginTop: '30px'}}>
                    <FontAwesomeIcon icon={faPlus} className="mr-2"/>{' '}
                    Creat New Product
                </button>
                <Input
                    style={{marginLeft: '100rem'}}
                    placeholder="Search for..."
                    value={this.state.search}
                    onChange={(e) => this.handleSearch(e)}
                    icon="search"
                />
                <table id="table">
                    <thead>
                        <tr>
                            <th><b>ID</b></th>
                            <th><b>Product</b></th>
                            <th><b>Name</b></th>
                            <th><b>Description</b></th>
                            <th><b>Quantity</b></th>
                            <th><b>Price</b></th>
                            <th>Update</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.products.map((p) => (
                                <tr key={p.id}>
                                    <td>{p.id}</td>
                                    <td>
                                        <img src={`data:image/jpeg;base64,${p.imageurl}`} alt="" height="100px"></img>
                                    </td>
                                    <td>{p.name}</td>
                                    <td className="descriptionTable">{p.description}</td>
                                    <td>{formatQuantity(p.quantity)}</td>
                                    <td>{formatCurrency(p.price)}</td>
                                    <td>
                                        <Link to={`/admin/product/update/${p.id}`}>
                                            <button className="btn btn-success">
                                            <FontAwesomeIcon icon={faEdit} className="mr-2"/>{' '}
                                                
                                            </button>
                                        </Link>
                                    </td>
                                    <td><button onClick={(e) => this.onToggleFormDel(e, p.id)} className="btn btn-danger" disabled={p.status === 'Stop'}>
                                        <FontAwesomeIcon icon={faTrash} className="mr-2"/>{' '}
                                        </button>
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