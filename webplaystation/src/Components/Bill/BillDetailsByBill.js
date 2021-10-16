import React, { Component } from 'react'
import { get, del, post } from '../../Utils/httpHelper'
import {formatCurrency} from "./../../Utils/Utils";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { withRouter } from "react-router";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import Add from '../BillDetails/Add';
import './Bill.css';
import {Icon} from 'semantic-ui-react';

class BillDetailsByBill extends Component {
    state = {
        id: this.props.match.params.id,
        billdetails: [],
        bill: {},
        iddel: {},
        isDisplayFormDel: false,
        pageNumber: 0,
        pageToTal: 0,
        user: {}
    }

    componentDidMount(){
        get(`/billDetails/bill/${this.state.id}`)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    //billdetails: response.data
                    pageToTal: Math.ceil(response.data.length / 3)
                })
            }
        })

        get(`/billDetails/billPage/${this.state.id}?pageNumber=0&pageSize=3&sortBy=id`)
        .then((response) => {
            this.setState({
                billdetails: response.data
            });
        })
        .catch(error => console.log(error));

        get(`/bills/${this.state.id}`)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    bill: response.data
                }, () => {get(`/users/${this.state.bill.user_id}`)
                        .then((response) => {
                            if (response.status === 200)
                            {
                                this.setState({
                                    user: response.data
                                })
                            }
                        })})
            }
        });
        // console.log(this.state.bill);
        // console.log(this.state.bill.user_id);
        // get(`/users/${this.state.bill.user_id}`)
        // .then((response) => {
        //     if (response.status === 200)
        //     {
        //         this.setState({
        //             user: response.data
        //         })
        //     }
        // })
    }

    delBillDetail = (e, id) =>
    {
        e.preventDefault();
        del(`/billDetails/${id.bill.id}-${id.product.id}`)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({billdetails: this.state.billdetails.filter(b => `${b.key.bill.id}-${b.key.product.id}` !== `${id.bill.id}-${id.product.id}`),
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
                    isDisplayForm: false,
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
        
        get(`/billDetails/billPage/${this.state.id}?pageNumber=${pageNumber}&pageSize=3&sortBy=id`)
        .then((response) => {
            this.setState({
                billdetails: response.data,
            });
        })
        .catch(error => console.log(error));
    }

    componentWillUnmount() {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }

    render() {
        // const stt = 0;
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

                <div className='info-user-bill'>
                    <h4 style={{fontWeight:'bold'}}>Thông Tin Khách Hàng</h4>
                    <p><Icon name="user" size="large"/>{this.state.user.account}</p>
                    <p><Icon name="id card outline" size="large"/>{this.state.user.name}</p>
                    <p><Icon name="home" size="large"/>{this.state.user.address}</p>
                    <p><Icon name="mail outline" size="large"/>{this.state.user.email}</p>
                    <p><Icon name="phone" size="large"/>{this.state.user.phone}</p>
                </div>

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
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td><img src={`data:image/jpeg;base64,${b.key.product.imageurl}`} alt="" height="75px"></img></td>
                                    <td>{b.key.product.name}</td>
                                    <td>{b.quantity}</td>
                                    <td>{formatCurrency(b.key.product.price)}</td>
                                    <td>
                                        {/* <Link to={`/admin/billDetails/update/${b.key.bill.id}-${b.key.product.id}`} billId={this.state.id} onClick={this.state.bill.billStatus_id === '1' ? (e) => e.preventDefault() : ''}>
                                            <button className="btn btn-success" disabled={this.state.bill.billStatus_id === '1'}> */}
                                        <Link to={`/admin/billDetails/update/${b.key.bill.id}-${b.key.product.id}`} billId={this.state.id} onClick={this.state.bill.status === 'Done' ? (e) => e.preventDefault() : ''}>
                                            <button className="btn btn-success" disabled={this.state.bill.status === 'Done'}>
                                                <FontAwesomeIcon icon={faEdit} className="mr-2"/>{' '}
                                            </button>
                                        </Link>
                                    </td>
                                    <td>
                                        {/* <button onClick={(e) => this.onToggleFormDel(e, b.key)} className="btn btn-danger" disabled={this.state.bill.billStatus_id === '1'}> */}
                                        <button onClick={(e) => this.onToggleFormDel(e, b.key)} className="btn btn-danger" disabled={this.state.bill.status === 'Done'}>
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