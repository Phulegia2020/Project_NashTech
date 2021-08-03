import React, { Component } from 'react';
import "./../Category/Category.css";
import {del, get, post, put} from "./../../Utils/httpHelper";
import { Link } from 'react-router-dom';
import { withRouter } from "react-router";
import Add from "./Add"
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEdit, faInfo, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

class Bill extends Component {
    state = {
        bills: [],
        isDisplayForm: false,
        pageNumber: 0,
        pageToTal: 0,
        users: [],
        billCheckOut: {}
    }

    componentDidMount(){
        get("/bills")
        .then((response) => {
            if (response.status === 200)
            {
                //console.log(response.data.length);
                //this.setState({products: response.data});
                this.setState({
                    pageToTal: Math.ceil(response.data.length / 10)
                })
            }
        })
        .catch(error => {console.log(error)})

        get(`/bills/page?pageNumber=0&pageSize=10&sortBy=id`)
        .then((response) => {
            this.setState({
                bills: response.data,
            });
        })
        .catch(error => console.log(error));

        get("/users")
        .then((response) => {
            if (response.status === 200)
            {
                //console.log(response.data);
                this.setState({users: response.data});
            }
        })
        .catch(error => {console.log(error)})
    }

    find(id){
        get(`/bills/${id}`)
        .then((response) => {
            if (response.status === 200)
            {
                //console.log(response.data);
            }
        })
    }

    delBill = (id) =>
    {
        del(`/bills/${id}`)
        .then((response) => {
            //console.log(response.data);
            this.setState({bills: this.state.bills.filter(b => b.id !== id)})
            alert(response.data.message);
        })
        .catch(error => {alert('This Bill had Details. Can not Delete!')})
    }

    createBill(newBill){
        post(`/bills`, {total: newBill.total, user_id: newBill.user_id, billStatus_id: newBill.billStatus_id})
        .then((response) => {
            //console.log(response.data);
            window.location.reload();
            this.setState({
                bills: [...this.state.bills, response.data],
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
        this.createBill(data);
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
        
        get(`/bills/page?pageNumber=${pageNumber}&pageSize=10&sortBy=id`)
        .then((response) => {
            this.setState({
                bills: response.data,
            });
        })
        .catch(error => console.log(error));
    }

    formatCurrency(number) {
        var options = {style: 'currency', currency: 'VND'};
        var numberFormat = new Intl.NumberFormat('en-US', options);

        return numberFormat.format(number);
    }

    // handleUserID = (buid) => {
    //     const uid = this.state.users.find((u) => {
    //         {u.id === buid}
    //     })
    //     return <td>{uid.name}</td>
    // }

    async handleCheckOut(event, id){
        event.preventDefault();
        console.log(id.toString());
        var bid = id.toString();
        await get(`/bills/${bid}`)
        .then((response) => {
            if (response.status === 200)
            {
                //console.log(response.data);
                this.setState({
                    billCheckOut: response.data
                }, () => console.log(response.data));
            }
        })

        //console.log('update');
        put(`/bills/${id}`, {total: this.state.billCheckOut.total, user_id: this.state.billCheckOut.user_id, billStatus_id: '1'})
        .then((response) => {
            if (response.status === 200)
            {
            //console.log(response.data);
                this.props.history.push("/admin/bill");
                window.location.reload();
            }
        })
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
                    Creat New Bill
                </button>
                <table id="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Total</th>
                            <th>Created Date</th>
                            <th>Update Date</th>
                            <th>User_ID</th>
                            <th>Status</th>
                            {/* <th>Category</th>
                            <th>Supplier</th> */}
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.bills.map((b) => (
                                <tr key={b.id}>
                                    <td>{b.id}</td>
                                    <td>{this.formatCurrency(b.total)}</td>
                                    <td>{b.createddate}</td>
                                    <td>{b.checkout_date}</td>
                                    {/* {this.handleUserID(b.user_id)} */}
                                    <td>{b.user_id}</td>
                                    <td>{b.billStatus_id === '1' ? 'Done' : 'Waiting CheckOut'}</td>
                                    {/* <td>{p.category_id}</td>
                                    <td>{p.supplier_id}</td> */}
                                    <td><button onClick={() => this.delBill(b.id)} className="btn btn-danger">
                                        <FontAwesomeIcon icon={faTrash} className="mr-2"/>{' '}
                                        Del
                                        </button>
                                    </td>
                                    <td>
                                        <Link to={`/admin/bill/update/${b.id}`}>
                                            <button className="btn btn-success">
                                            <FontAwesomeIcon icon={faEdit} className="mr-2"/>{' '}
                                                Update
                                            </button>
                                        </Link>
                                    </td>
                                    <td>
                                        <Link to={`/admin/bill`}>
                                            <button className="btn btn-warning" onClick={(event) => this.handleCheckOut(event, b.id)}>
                                            <FontAwesomeIcon icon={faCheck} className="mr-2"/>{' '}
                                                CheckOut
                                            </button>
                                        </Link>
                                    </td>
                                    <td>
                                        <Link to={`/admin/bill/${b.id}`}>
                                            <button className="btn btn-info">
                                            <FontAwesomeIcon icon={faInfo} className="mr-2"/>{' '}
                                                Details
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
                        <ModalHeader toggle={this.onToggleForm}>Create New Bill</ModalHeader>
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

export default withRouter(Bill);