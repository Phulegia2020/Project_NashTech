import React, { Component } from 'react'
import { get, del } from '../../Utils/httpHelper'
import { withRouter } from "react-router";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { formatCurrency, formatQuantity } from '../../Utils/Utils';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Pagination, PaginationItem, PaginationLink } from 'reactstrap';

class ProductByCategory extends Component {
    state = {
        id: this.props.match.params.id,
        products: [],
        iddel: "",
        isDisplayFormDel: false,
    }

    componentDidMount(){
        get(`/products/search?categoryId=${this.state.id}`)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    products: response.data
                });
            }
        })
    }

    delProduct = (e, id) =>
    {
        e.preventDefault();
        del(`/products/${id}`)
        .then((response) => {
            this.setState({products: this.state.products.filter(p => p.id !== id), isDisplayFormDel: false})
        })
        .catch(error => {console.log(error)})
    }

    onToggleFormDel = (e, id) => {
        e.preventDefault()
        this.setState({
            isDisplayFormDel: !this.state.isDisplayFormDel,
            iddel: id
        });
    }

    onCloseFormDel = (e) => {
        e.preventDefault()
        this.setState({
            isDisplayFormDel: false,
        });
    }

    componentWillUnmount() {
        this.setState({
            products: []
        })
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }

    render() {
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
                        <Button onClick={(e) => this.delProduct(e, this.state.iddel)} className="btn-danger">Delete</Button>
                        <Button onClick={(e) => this.onCloseFormDel(e)}>Close</Button>
                    </ModalFooter>
                </Modal>
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
                                    <td>{p.status}</td>
                                    <td>
                                        <Link to={`/admin/product/update/${p.id}`}>
                                            <button className="btn btn-success">
                                                <FontAwesomeIcon icon={faEdit} className="mr-2"/>{' '}
                                                
                                            </button>
                                        </Link>
                                    </td>
                                    <td><button className="btn btn-danger" onClick={(e) => this.onToggleFormDel(e, p.id)} disabled={p.status === 'Stop'}>
                                        <FontAwesomeIcon icon={faTrash} className="mr-2"/>{' '}
                                        
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        )
    }
}

export default withRouter(ProductByCategory);