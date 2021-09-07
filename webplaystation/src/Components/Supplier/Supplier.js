import React, { Component } from 'react';
import "./../Category/Category.css";
import {del, get, post} from "./../../Utils/httpHelper";
import { Link } from 'react-router-dom';
import Add from "./Add"
import { Modal, ModalHeader, ModalBody, ModalFooter, Pagination, PaginationItem, PaginationLink, Button} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

export default class Supplier extends Component {
    state = {
        suppliers: [],
        isDisplayForm: false,
        isDisplayFormDel: false,
        pageNumber: 0,
        pageToTal: 0,
        msgDel: false,
        id: ""
    }

    componentDidMount(){
        get("/suppliers")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    pageToTal: Math.ceil(response.data.length / 5)
                })
            }
        })
        .catch(error => {console.log(error)})

        get(`/suppliers/page?pageNumber=0&pageSize=5&sortBy=id`)
        .then((response) => {
            this.setState({
                suppliers: response.data
            });
        })
        .catch(error => console.log(error));
    }

    find(id){
        get(`/suppliers/${id}`)
        .then((response) => {
            if (response.status === 200)
            {
            }
        })
    }

    delSupplier(e, id)
    {
        e.preventDefault();
        del(`/suppliers/${id}`)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({suppliers: this.state.suppliers.filter(sup => sup.id !== id), isDisplayFormDel: false})
            }
            else{
                this.setState({
                    msgDel: true
                })
            }
        })
        .catch(error => {alert('This Supplier is supplying products. Can not delete!')})
    }

    createSupplier(newSupplier){
        post(`/suppliers`, {name: newSupplier.name.trim(), address: newSupplier.address.trim(), phone: newSupplier.phone.trim()})
        .then((response) => {
            window.location.reload();
            this.setState({
                suppliers: [...this.state.suppliers, response.data],
            });
        });
    }

    onAdd = (data) => {
        this.createSupplier(data);
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
        
        get(`/suppliers/page?pageNumber=${pageNumber}&pageSize=5&sortBy=id`)
        .then((response) => {
            this.setState({
                suppliers: response.data,
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
                        <Button onClick={(e) => this.delSupplier(e, this.state.id)} className="btn-danger">Delete</Button>
                        <Button onClick={(e) => this.onCloseFormDel(e)}>Close</Button>
                    </ModalFooter>
                </Modal>
                <button type="button" className="btn btn-primary" onClick={this.onToggleForm}>
                    <FontAwesomeIcon icon={faPlus} className="mr-2"/>{' '}
                    Creat New Supplier
                </button>
                <table id="table">
                    <thead>
                        <tr>
                            <th><b>ID</b></th>
                            <th><b>Name</b></th>
                            <th><b>Address</b></th>
                            <th><b>Phone</b></th>
                            <th>Update</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.suppliers.map((sup) => (
                                <tr key={sup.id}>
                                    <td>{sup.id}</td>
                                    <td>{sup.name}</td>
                                    <td>{sup.address}</td>
                                    <td>{sup.phone}</td>
                                    <td>
                                        <Link to={`/admin/supplier/update/${sup.id}`}>
                                            <button className="btn btn-success">
                                            <FontAwesomeIcon icon={faEdit} className="mr-2"/>{' '}
                                                
                                            </button>
                                        </Link>
                                    </td>
                                    <td><button className="btn btn-danger" onClick={(e) => this.onToggleFormDel(e, sup.id)}>
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
                        <ModalHeader toggle={this.onToggleForm}>Create New Supplier</ModalHeader>
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
