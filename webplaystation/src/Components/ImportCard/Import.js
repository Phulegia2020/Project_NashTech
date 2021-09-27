import React, { Component } from 'react'
import "./../Category/Category.css";
import {del, get, post, put} from "./../../Utils/httpHelper";
import {formatCurrency} from "./../../Utils/Utils";
import { Link } from 'react-router-dom';
import Add from "./Add"
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faInfo, faPlus, faTrash, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Label, Breadcrumb } from 'semantic-ui-react';

export default class Import extends Component {
    state = {
        imports: [],
        isDisplayForm: false,
        isDisplayFormDel: false,
        pageNumber: 0,
        pageToTal: 0,
        importConfirm: {},
        placeorderdetails: [],
        id: ""
    }

    componentDidMount(){
        get("/imports")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    pageToTal: Math.ceil(response.data.length / 9)
                })
            }
        })
        .catch(error => {console.log(error)})

        get(`/imports/page?pageNumber=0&pageSize=9&sortBy=id`)
        .then((response) => {
            this.setState({
                imports: response.data,
            });
        })
        .catch(error => console.log(error));
    }

    find(id){
        get(`/imports/${id}`)
        .then((response) => {
            if (response.status === 200)
            {
            }
        })
    }

    delImport = (e, id) =>
    {
        e.preventDefault();
        del(`/imports/${id}`)
        .then((response) => {
            this.setState({imports: this.state.imports.filter(b => b.id !== id),
                           isDisplayFormDel: false})
        })
        .catch(error => {alert('This Import had details. Can not Delete!')})
    }

    async createImport(newImport){
        await get(`/placeorderDetails/placeOrder/${newImport.placeorder_id}`)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    placeorderdetails: response.data
                })
            }
        })
        if (this.state.placeorderdetails.length === 0)
        {
            alert('The Place Order has not details');
            return;
        }
        post(`/imports`, {total: 0, user_id: newImport.user_id, placeOrder_id: newImport.placeorder_id})
        .then((response) => {
            //window.location.reload();
            this.setState({
                // imports: [...this.state.imports, response.data],
                imports: [response.data, ...this.state.imports],
            });
        })
        .catch((error) => {});
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
        this.createImport(data);
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
        
        get(`/imports/page?pageNumber=${pageNumber}&pageSize=9&sortBy=id`)
        .then((response) => {
            this.setState({
                imports: response.data,
            });
        })
        .catch(error => console.log(error));
    }

    async handleConfirm(event, id){
        event.preventDefault();
        await get(`/imports/${id}`)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    importConfirm: response.data
                });
            }
        })
        put(`/imports/confirm/${id}`, {total: this.state.importConfirm.total, user_id: this.state.importConfirm.user_id, placeOrder_id: this.state.importConfirm.placeorder_id})
        .then((response) => {
            if (response.status === 200)
            {
                window.location.href="/admin/import";
            }
        })
        .catch((error)=> {})
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
            { key: 'Phiếu Nhập', content: 'Phiếu Nhập', active: true }
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
                        <Button onClick={(e) => this.delImport(e, this.state.id)} className="btn-danger">Delete</Button>
                        <Button onClick={(e) => this.onCloseFormDel(e)}>Close</Button>
                    </ModalFooter>
                </Modal>
                <Breadcrumb icon='right angle' sections={sections} size='large'/>
                <br/>
                <button type="button" className="btn btn-primary" onClick={this.onToggleForm} style={{marginTop: '30px'}}>
                    <FontAwesomeIcon icon={faPlus} className="mr-2"/>{' '}
                    Creat New Import
                </button>
                <table id="table">
                    <thead>
                        <tr>
                            <th><b>ID</b></th>
                            <th><b>Total</b></th>
                            <th><b>Created Date</b></th>
                            <th><b>Place Order</b></th>
                            <th><b>Employee</b></th>
                            <th>Status</th>
                            <th>Update</th>
                            <th>Delete</th>
                            <th>Details</th>
                            <th>Confirm</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.imports.map((imp) => (
                                <tr key={imp.id}>
                                    <td>{imp.id}</td>
                                    <td>{formatCurrency(imp.total)}</td>
                                    <td>{imp.createddate}</td>
                                    <td>{imp.placeOrder.id}</td>
                                    <td>{imp.user.name}</td>
                                    {imp.status === 'Done' && (<td><Label color="teal">{imp.status}</Label></td>)}
                                    {imp.status === 'Waiting' && (<td><Label color="grey">{imp.status}</Label></td>)}
                                    <td>
                                        <Link to={`/admin/import/update/${imp.id}`} onClick={imp.status !== 'Waiting' ? (e) => e.preventDefault() : ''} className={imp.status !== 'Waiting' ? "disable-link" : ""}>
                                            <button className="btn btn-success" disabled={imp.status !== 'Waiting'}>
                                            <FontAwesomeIcon icon={faEdit} className="mr-2"/>{' '}
                                                
                                            </button>
                                        </Link>
                                    </td>
                                    <td><button onClick={(e) => this.onToggleFormDel(e, imp.id)} className="btn btn-danger" disabled={imp.status !== 'Waiting'}>
                                        <FontAwesomeIcon icon={faTrash} className="mr-2"/>{' '}
                                        
                                        </button>
                                    </td>
                                    <td>
                                        <Link to={`/admin/import/${imp.id}`}>
                                            <button className="btn btn-info">
                                            <FontAwesomeIcon icon={faInfo} className="mr-2"/>{' '}
                                                
                                            </button>
                                        </Link>
                                    </td>
                                    <td>
                                        <Link to={`/admin/import`}  onClick={imp.status !== 'Waiting' ? (e) => e.preventDefault() : ''} className={imp.status !== 'Waiting' ? "disable-link" : ""}>
                                            <button className="btn btn-warning" onClick={(event) => this.handleConfirm(event, imp.id)} disabled={imp.status !== 'Waiting'}>
                                            <FontAwesomeIcon icon={faCheck} className="mr-2"/>{' '}
                                                
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
                        <ModalHeader toggle={this.onToggleForm}>Create New Import</ModalHeader>
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
