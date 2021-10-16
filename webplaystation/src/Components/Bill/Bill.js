import React, { Component } from 'react';
import "./../Category/Category.css";
import {del, get, post, put} from "./../../Utils/httpHelper";
import {formatCurrency} from "./../../Utils/Utils";
import { Link } from 'react-router-dom';
import { withRouter } from "react-router";
import Add from "./Add"
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEdit, faInfo, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Label, Breadcrumb, Input } from 'semantic-ui-react';

class Bill extends Component {
    state = {
        bills: [],
        isDisplayForm: false,
        isDisplayFormDel: false,
        pageNumber: 0,
        pageToTal: 0,
        users: [],
        billCheckOut: {},
        billdetails: [],
        user:"",
        usermail: '',
        username: "",
        id: "",
        search: ""
    }

    componentDidMount(){
        get("/bills")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    pageToTal: Math.ceil(response.data.length / 9)
                })
            }
        })
        .catch(error => {console.log(error)})

        get(`/bills/page?pageNumber=0&pageSize=9&sortBy=id`)
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
            }
        })
    }

    delBill = (e, id) =>
    {
        e.preventDefault();
        del(`/bills/${id}`)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({bills: this.state.bills.filter(b => b.id !== id),
                               isDisplayFormDel: false})
            }
        })
        .catch(error => {alert('This Bill had Details. Can not Delete!')})
    }

    createBill(newBill){
        // post(`/bills`, {total: 0, user_id: newBill.user_id, billStatus_id: newBill.billStatus_id})
        post(`/bills`, {total: 0, user_id: newBill.user_id, status: newBill.status})
        .then((response) => {
            //window.location.reload();
            this.setState({
                bills: [response.data, ...this.state.bills],
                isDisplayForm: false,
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
        
        if (this.state.search === '')
        {
            get(`/bills/page?pageNumber=${pageNumber}&pageSize=9&sortBy=id`)
            .then((response) => {
                this.setState({
                    bills: response.data,
                });
            })
            .catch(error => console.log(error));
        }
        else
        {
            get(`/bills/fullNamePage?name=${this.state.search}&pageNumber=${pageNumber}&pageSize=9&sortBy=id`)
            .then((response) => {
                this.setState({
                    bills: response.data,
                });
            })
            .catch(error => console.log(error));
        }
    }

    async handleCheckOut(event, id, key){
        event.preventDefault();
        console.log(id.toString());
        var bid = id.toString();
        await get(`/bills/${bid}`)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    billCheckOut: response.data,
                }, () => console.log(response.data));
            }
        })
        await get(`/billDetails/bill/${id}`)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    billdetails: response.data
                })
            }
        })
        .catch((error) => {})
        //console.log(this.state.billdetails.length);
        if (this.state.billdetails.length === 0)
        {
            alert('The Bill does not details. Can not Check Out');
            return;
        }
        // var status;
        // if (key == 'notcheck')
        // {
        //     status = '1';
        // }
        // else
        // {
        //     status = '3';
        // }
        // put(`/bills/confirm/${id}`, {total: this.state.billCheckOut.total, user_id: this.state.billCheckOut.user_id, billStatus_id: status})
        put(`/bills/confirm/${id}`, {total: this.state.billCheckOut.total, user_id: this.state.billCheckOut.user_id, status: 'Done'})
        .then((response) => {
            if (response.status === 200)
            {
                this.props.history.push("/admin/bill");
                window.location.reload();
            }
        })
    }

    async handleSearch(e){
        e.preventDefault()
        await this.setState({
            search: e.target.value
        })
        if (this.state.search === '')
        {
            get("/bills")
            .then((response) => {
                if (response.status === 200)
                {
                    this.setState({
                        pageToTal: Math.ceil(response.data.length / 9)
                    })
                }
            })
            .catch(error => {console.log(error)})

            get(`/bills/page?pageNumber=0&pageSize=9&sortBy=id`)
            .then((response) => {
                this.setState({
                    bills: response.data,
                });
            })
            .catch(error => console.log(error));
        }
        else
        {
            get(`/bills/fullName?name=${this.state.search}`)
            .then((response) => {
                if (response.status === 200)
                {
                    this.setState({
                        pageToTal: Math.ceil(response.data / 9)
                    });
                }
            })
            .catch(error => {console.log(error)})

            get(`/bills/fullNamePage?name=${this.state.search}&pageNumber=0&pageSize=9&sortBy=id`)
            .then((response) => {
                this.setState({
                    bills: response.data,
                });
            })
            .catch(error => console.log(error));
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
            { key: 'Hóa Đơn', content: 'Hóa Đơn', active: true }
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
                        <Button onClick={(e) => this.delBill(e, this.state.id)} className="btn-danger">Delete</Button>
                        <Button onClick={(e) => this.onCloseFormDel(e)}>Close</Button>
                    </ModalFooter>
                </Modal>
                <Breadcrumb icon='right angle' sections={sections} size='large'/>
                <br/>
                <button type="button" className="btn btn-primary" onClick={this.onToggleForm} style={{marginTop: '15px', marginBottom: '5px'}}>
                    <FontAwesomeIcon icon={faPlus} className="mr-2"/>{' '}
                    Creat New Bill
                </button>
                <Input
                    style={{marginLeft: '100rem'}}
                    placeholder="Tên khách hàng..."
                    value={this.state.search}
                    onChange={(e) => this.handleSearch(e)}
                    icon="search"
                />
                <table id="table">
                    <thead>
                        <tr>
                            <th><b>ID</b></th>
                            <th><b>Total</b></th>
                            <th><b>Created Date</b></th>
                            <th><b>CheckedOut Date</b></th>
                            <th><b>Customer</b></th>
                            <th><b>Status</b></th>
                            <th>Update</th>
                            <th>Delete</th>
                            <th>Details</th>
                            <th>Check Out</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.bills.map((b) => (
                                <tr key={b.id}>
                                    <td>{b.id}</td>
                                    <td>{formatCurrency(b.total)}</td>
                                    <td>{b.createddate}</td>
                                    <td>{b.checkout_date}</td>
                                    <td>{b.user.name}</td>
                                    {/* <td>{b.billStatus.id === 1 ? <Label color="teal">Done</Label> : <Label color="grey">Waiting CheckOut</Label>}</td> */}
                                    <td>{b.status === 'Done' ? <Label color="teal">Hoàn Tất</Label> : <Label color="grey">Chờ Xác Nhận</Label>}</td>
                                    <td>
                                        {/* {b.billStatus.id != 1 ? 
                                        <Link to={`/admin/bill/update/${b.id}`}>
                                            <button className="btn btn-success" disabled={b.billStatus.id == 1}>
                                            <FontAwesomeIcon icon={faEdit} className="mr-2"/>{' '}
                                            </button>
                                        </Link> : 
                                        <button className="btn btn-success" disabled={b.billStatus.id == 1}>
                                        <FontAwesomeIcon icon={faEdit} className="mr-2"/>{' '}
                                        </button>
                                        } */}
                                        {b.status !== 'Done' ? 
                                        <Link to={`/admin/bill/update/${b.id}`}>
                                            <button className="btn btn-success" disabled={b.status === 'Done'}>
                                                <FontAwesomeIcon icon={faEdit} className="mr-2"/>{' '}
                                            </button>
                                        </Link> : 
                                        <button className="btn btn-success" disabled={b.status === 'Done'}>
                                            <FontAwesomeIcon icon={faEdit} className="mr-2"/>{' '}
                                        </button>
                                        }
                                    </td>
                                    <td>
                                        {/* <button onClick={(e) => this.onToggleFormDel(e, b.id)} className="btn btn-danger" disabled={b.billStatus.id == 1}> */}
                                        <button onClick={(e) => this.onToggleFormDel(e, b.id)} className="btn btn-danger" disabled={b.status === 'Done'}>
                                            <FontAwesomeIcon icon={faTrash} className="mr-2" />{' '}
                                        </button>
                                    </td>
                                    <td>
                                        <Link to={`/admin/bill/${b.id}`}>
                                            <button className="btn btn-info">
                                                <FontAwesomeIcon icon={faInfo} className="mr-2"/>{' '}
                                            </button>
                                        </Link>
                                    </td>
                                    <td>
                                        {/* <Link to={`/admin/bill`} onClick={b.billStatus.id == 1 ? (e) => e.preventDefault() : (event) => this.handleCheckOut(event, b.id, 'notcheck')} className={b.billStatus.id == 1 ? "disable-link" : ""}>
                                            <button className="btn btn-warning" disabled={b.billStatus.id == 1}>
                                            <FontAwesomeIcon icon={faCheck} className="mr-2"/>{' '}
                                                
                                            </button>
                                        </Link> */}
                                        <Link to={`/admin/bill`} onClick={b.status === 'Done' ? (e) => e.preventDefault() : (event) => this.handleCheckOut(event, b.id, '')} className={b.status === 'Done' ? "disable-link" : ""}>
                                            <button className="btn btn-warning" disabled={b.status === 'Done'}>
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