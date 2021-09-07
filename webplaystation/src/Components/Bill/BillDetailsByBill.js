import React, { Component } from 'react'
import { get, del, post } from '../../Utils/httpHelper'
import {formatCurrency} from "./../../Utils/Utils";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEdit, faInfo, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { withRouter } from "react-router";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import Add from '../BillDetails/Add';

class BillDetailsByBill extends Component {
    state = {
        id: this.props.match.params.id,
        billdetails: [],
        bill: {},
        iddel: "",
        isDisplayFormDel: false,
    }

    componentDidMount(){
        get(`/billDetails/bill/${this.state.id}`)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    billdetails: response.data
                })
            }
        })

        get(`/bills/${this.state.id}`)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    bill: response.data
                })
            }
        });
    }

    delBillDetail = (e, id) =>
    {
        e.preventDefault();
        del(`/billDetails/${id}`)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({billdetails: this.state.billdetails.filter(b => b.id !== id),
                               isDisplayFormDel: false})
            }
        })
        .catch(error => {console.log(error)})
    }

    createBillDetail(newBillDetail){
        post(`/billDetails`, {quantity: newBillDetail.quantity, bill_id: newBillDetail.bill_id, product_id: newBillDetail.product_id})
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    billdetails: [...this.state.billdetails, response.data],
                })
            }
        })
        .catch((error) => alert('This bill had include this product. Choose another product!'));
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
        this.createBillDetail(data);
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
                        <Button onClick={(e) => this.delBillDetail(e, this.state.iddel)} className="btn-danger">Delete</Button>
                        <Button onClick={(e) => this.onCloseFormDel(e)}>Close</Button>
                    </ModalFooter>
                </Modal>
                <button type="button" className="btn btn-primary" onClick={this.onToggleForm}>
                    <FontAwesomeIcon icon={faPlus} className="mr-2"/>{' '}
                    Creat New Bill Detail
                </button>
                <table id="table">
                    <thead>
                        <tr>
                            <th><b>No.</b></th>
                            <th><b>Image</b></th>
                            <th><b>Product Name</b></th>
                            <th><b>Quantity</b></th>
                            <th><b>Price</b></th>
                            <th>Update</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.billdetails.map((b, index) => (
                                <tr key={b.id}>
                                    <td>{index + 1}</td>
                                    <td><img src={`data:image/jpeg;base64,${b.product.imageurl}`} alt="" height="75px"></img></td>
                                    <td>{b.product.name}</td>
                                    <td>{b.quantity}</td>
                                    <td>{formatCurrency(b.product.price)}</td>
                                    <td>
                                        <Link to={`/admin/billDetails/update/${b.id}`} billId={this.state.id} onClick={this.state.bill.billStatus_id === '1' ? (e) => e.preventDefault() : ''}>
                                            <button className="btn btn-success" disabled={this.state.bill.billStatus_id === '1'}>
                                            <FontAwesomeIcon icon={faEdit} className="mr-2"/>{' '}
                                                
                                            </button>
                                        </Link>
                                    </td>
                                    <td><button onClick={(e) => this.onToggleFormDel(e, b.id)} className="btn btn-danger" disabled={this.state.bill.billStatus_id === '1'}>
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
                        <ModalHeader toggle={this.onToggleForm}>Create New Bill Detail</ModalHeader>
                        <ModalBody>
                            <Add onAdd={this.onAdd} onCloseForm={this.onCloseForm} bill={this.state.id} billDet={this.state.billdetails}/>
                        </ModalBody>
                        <ModalFooter>
                        </ModalFooter>
                    </Modal>
                </div>
            </div>
        )
    }
}

export default withRouter(BillDetailsByBill);