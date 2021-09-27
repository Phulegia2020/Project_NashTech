import React, { Component } from 'react'
import "./../Category/Category.css";
import {del, get, post} from "./../../Utils/httpHelper";
import {formatCurrency} from "./../../Utils/Utils";
import { Link } from 'react-router-dom';
import Add from "./Add"
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faInfo, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Label, Breadcrumb } from 'semantic-ui-react';

export default class PlaceOrder extends Component {
    state = {
        placeorders: [],
        isDisplayForm: false,
        isDisplayFormDel: false,
        pageNumber: 0,
        pageToTal: 0,
        id: ""
    }

    componentDidMount(){
        get("/placeorders")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    pageToTal: Math.ceil(response.data.length / 9)
                })
            }
        })
        .catch(error => {console.log(error)})

        get(`/placeorders/page?pageNumber=0&pageSize=9&sortBy=id`)
        .then((response) => {
            this.setState({
                placeorders: response.data,
            });
        })
        .catch(error => console.log(error));
    }

    find(id){
        get(`/placeorders/${id}`)
        .then((response) => {
            if (response.status === 200)
            {
            }
        })
    }

    delPlaceOrder = (e, id) =>
    {
        del(`/placeorders/${id}`)
        .then((response) => {
            this.setState({placeorders: this.state.placeorders.filter(b => b.id !== id), isDisplayFormDel: false})
        })
        .catch((error) => {alert('The Place Order had details or approved by import card. Can not delete!')});
    }

    createPlaceOrder(newPlaceOrder){
        post(`/placeorders`, {total: 0, user_id: newPlaceOrder.user_id, supplier_id: newPlaceOrder.supplier_id})
        .then((response) => {
            //window.location.reload();
            if (response.status === 200)
            {
                this.setState({
                    placeorders: [response.data, ...this.state.placeorders],
                });
            }
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
        this.createPlaceOrder(data);
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
        
        get(`/placeorders/page?pageNumber=${pageNumber}&pageSize=9&sortBy=id`)
        .then((response) => {
            this.setState({
                placeorders: response.data,
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
        const sections = [
            { key: 'Quản Lý', content: 'Quản Lý', link: false },
            { key: 'Phiếu Đặt', content: 'Phiếu Đặt', active: true }
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
                        Are you sure?
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={(e) => this.delPlaceOrder(e, this.state.id)} className="btn-danger">Delete</Button>
                        <Button onClick={(e) => this.onCloseFormDel(e)}>Close</Button>
                    </ModalFooter>
                </Modal>
                <Breadcrumb icon='right angle' sections={sections} size='large'/>
                <br/>
                <button type="button" className="btn btn-primary" onClick={this.onToggleForm} style={{marginTop: '30px'}}>
                    <FontAwesomeIcon icon={faPlus} className="mr-2"/>{' '}
                    Creat New Place Order
                </button>
                <table id="table">
                    <thead>
                        <tr>
                            <th><b>ID</b></th>
                            <th><b>Total</b></th>
                            <th><b>Created Date</b></th>
                            <th><b>Employee</b></th>
                            <th><b>Supplier</b></th>
                            <th><b>Status</b></th>
                            <th>Update</th>
                            <th>Delete</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.placeorders.map((po) => (
                                <tr key={po.id}>
                                    <td>{po.id}</td>
                                    <td>{formatCurrency(po.total)}</td>
                                    <td>{po.createddate}</td>
                                    <td>{po.user.name}</td>
                                    <td>{po.supplier.name}</td>
                                    {po.status === 'Done' && (<td><Label color="teal">{po.status}</Label></td>)}
                                    {po.status === 'Waiting' && (<td><Label color="grey">{po.status}</Label></td>)}
                                    <td>
                                        {po.status !=='Done' ? 
                                        <Link to={`/admin/placeorder/update/${po.id}`}>
                                            <button className="btn btn-success">
                                                <FontAwesomeIcon icon={faEdit} className="mr-2"/>{' '}
                                                
                                            </button>
                                        </Link> : 
                                        <button className="btn btn-success" disabled>
                                            <FontAwesomeIcon icon={faEdit} className="mr-2"/>{' '}
                                            
                                        </button>}
                                    </td>
                                    <td><button onClick={(e) => this.onToggleFormDel(e, po.id)} className="btn btn-danger" disabled={po.status === "Done"}>
                                        <FontAwesomeIcon icon={faTrash} className="mr-2"/>{' '}
                                        
                                        </button>
                                    </td>
                                    <td>
                                        <Link to={`/admin/placeorder/${po.id}`}>
                                            <button className="btn btn-info">
                                            <FontAwesomeIcon icon={faInfo} className="mr-2"/>{' '}
                                                
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
                        <ModalHeader toggle={this.onToggleForm}>Create New Place Order</ModalHeader>
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
