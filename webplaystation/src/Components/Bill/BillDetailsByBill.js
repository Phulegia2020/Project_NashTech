import React, { Component } from 'react'
import { get, del, post } from '../../Utils/httpHelper'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEdit, faInfo, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { withRouter } from "react-router";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import Add from '../BillDetails/Add';

class BillDetailsByBill extends Component {
    state = {
        id: this.props.match.params.id,
        billdetails: []
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
    }

    delBillDetail = (id) =>
    {
        del(`/billDetails/${id}`)
        .then((response) => {
            //console.log(response.data);
            this.setState({billdetails: this.state.billdetails.filter(b => b.id !== id)})
            alert(response.data.message);
        })
        .catch(error => {console.log(error)})
    }

    createBillDetail(newBillDetail){
        post(`/billDetails`, {quantity: newBillDetail.quantity, bill_id: newBillDetail.bill_id, product_id: newBillDetail.product_id})
        .then((response) => {
            if (response.status === 200)
            {
            //console.log(response.data);
                this.setState({
                    billdetails: [...this.state.billdetails, response.data],
                })
            }
        })
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
                <button type="button" className="btn btn-primary" onClick={this.onToggleForm}>
                    <FontAwesomeIcon icon={faPlus} className="mr-2"/>{' '}
                    Creat New Bill Detail
                </button>
                <table id="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Quantity</th>
                            <th>Product_ID</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.billdetails.map((b) => (
                                <tr key={b.id}>
                                    <td>{b.id}</td>
                                    <td>{b.quantity}</td>
                                    <td>{b.product_id}</td>
                                    <td><button onClick={() => this.delBillDetail(b.id)} className="btn btn-danger">
                                        <FontAwesomeIcon icon={faTrash} className="mr-2"/>{' '}
                                        Del
                                        </button>
                                    </td>
                                    <td>
                                        <Link to={`/admin/billDetails/update/${b.id}`}>
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
                <div className="container">
                    <Modal isOpen={this.state.isDisplayForm} toggle={this.onToggleForm}>
                        <ModalHeader toggle={this.onToggleForm}>Create New Bill</ModalHeader>
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