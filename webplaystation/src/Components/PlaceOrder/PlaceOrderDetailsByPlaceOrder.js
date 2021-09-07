import React, { Component } from 'react'
import { get, del, post } from '../../Utils/httpHelper'
import { formatCurrency, formatQuantity } from '../../Utils/Utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import Add from '../PlaceOrderDetails/Add';
import { withRouter } from "react-router";

class PlaceOrderDetailsByPlaceOrder extends Component {
    state = {
        id: this.props.match.params.id,
        placeorderdetails: [],
        placeorder: {},
        isDisplayForm: false,
        isDisplayFormDel: false,
        iddel: ""
    }

    componentDidMount(){
        get(`/placeorderDetails/placeOrder/${this.state.id}`)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    placeorderdetails: response.data
                })
            }
        })

        get(`/placeorders/${this.state.id}`)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    placeorder: response.data
                })
            }
        })
    }

    delPlaceOrderDetail = (e, id) =>
    {
        e.preventDefault();
        del(`/placeorderDetails/${id}`)
        .then((response) => {
            this.setState({placeorderdetails: this.state.placeorderdetails.filter(b => b.id !== id), isDisplayFormDel: false})
        })
        .catch(error => {console.log(error)})
    }

    createPlaceOrderDetail(newPlaceOrderDetail){
        post(`/placeorderDetails`, {quantity: newPlaceOrderDetail.quantity, price: newPlaceOrderDetail.price, product_id: newPlaceOrderDetail.product_id, placeorder_id: newPlaceOrderDetail.placeorder_id})
        .then((response) => {
            if (response.status === 200)
            {
                console.log(response.data);
                this.setState({
                    placeorderdetails: [...this.state.placeorderdetails, response.data],
                })
            }
        })
        .catch((error) => {alert('The Place Order Details included the product')});
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
            iddel: id
        });
    }

    onCloseFormDel = (e) => {
        e.preventDefault()
        this.setState({
            isDisplayFormDel: false,
        });
    }


    onAdd = (data) => {
        this.createPlaceOrderDetail(data);
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
                        Are you sure?
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={(e) => this.delPlaceOrderDetail(e, this.state.iddel)} className="btn-danger">Delete</Button>
                        <Button onClick={(e) => this.onCloseFormDel(e)}>Close</Button>
                    </ModalFooter>
                </Modal>
                <button type="button" className="btn btn-primary" onClick={this.onToggleForm}>
                    <FontAwesomeIcon icon={faPlus} className="mr-2"/>{' '}
                    Creat New Place Order Detail
                </button>
                <table id="table">
                    <thead>
                        <tr>
                            <th><b>No.</b></th>
                            <th><b>Product</b></th>
                            <th><b>Product_Name</b></th>
                            <th><b>Quantity</b></th>
                            <th><b>Price</b></th>
                            <th>Update</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.placeorderdetails.map((po, index) => (
                                <tr key={po.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <img src={`data:image/jpeg;base64,${po.product.imageurl}`} alt="" height="100px"></img>
                                    </td>
                                    <td>{po.product.name}</td>
                                    <td>{formatQuantity(po.quantity)}</td>
                                    <td>{formatCurrency(po.price)}</td>
                                    <td>
                                        <Link to={`/admin/placeorderDetails/update/${po.id}`} onClick={this.state.placeorder.status === 'Done' ? (e) => e.preventDefault() : ''} className={this.state.placeorder.status === 'Done' ? "disable-link" : ""}>
                                            <button className="btn btn-success" disabled={this.state.placeorder.status === 'Done'}>
                                            <FontAwesomeIcon icon={faEdit} className="mr-2"/>{' '}
                                                
                                            </button>
                                        </Link>
                                    </td>
                                    <td><button onClick={(e) => this.onToggleFormDel(e, po.id)} className="btn btn-danger" disabled={this.state.placeorder.status === 'Done'}>
                                        <FontAwesomeIcon icon={faTrash} className="mr-2"/>{' '}
                                        
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                <div className="container">
                    <Modal isOpen={this.state.isDisplayForm} toggle={this.onToggleForm}>
                        <ModalHeader toggle={this.onToggleForm}>Create New Place Order Detail</ModalHeader>
                        <ModalBody>
                            <Add onAdd={this.onAdd} onCloseForm={this.onCloseForm} placeorder={this.state.id} placeorderDet={this.state.placeorderdetails}/>
                        </ModalBody>
                        <ModalFooter>
                        </ModalFooter>
                    </Modal>
                </div>
            </div>
        )
    }
}

export default withRouter(PlaceOrderDetailsByPlaceOrder);