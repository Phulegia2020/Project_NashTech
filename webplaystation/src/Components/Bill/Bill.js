import React, { Component } from 'react';
import "./../Category/Category.css";
import {del, get, post, put} from "./../../Utils/httpHelper";
import {formatCurrency} from "./../../Utils/Utils";
import { Link } from 'react-router-dom';
import { withRouter } from "react-router";
import Add from "./Add"
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEdit, faPlus, faTrash, faArrowCircleUp, faArrowCircleDown, faReceipt } from '@fortawesome/free-solid-svg-icons';
import { Label, Breadcrumb, Input } from 'semantic-ui-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class Bill extends Component {
    state = {
        bills: [],
        isDisplayForm: false,
        isDisplayFormDel: false,
        pageNumber: 0,
        pageToTal: 0,
        billCheckOut: {},
        billdetails: [],
        user:"",
        usermail: '',
        username: "",
        id: "",
        search: "",
        currentPage: 9
    }

    componentDidMount(){
        get("/bills/status")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    pageToTal: Math.ceil(response.data.length / this.state.currentPage)
                })
            }
        })
        .catch(error => {console.log(error)})

        get(`/bills/statusPage?pageNumber=0&pageSize=${this.state.currentPage}&sortBy=id`)
        .then((response) => {
            this.setState({
                bills: response.data,
            });
        })
        .catch(error => console.log(error));
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
        .catch(error => {toast.error('Hóa đơn đã được lập chi tiết!')})
    }

    createBill(newBill){
        post(`/bills`, {total: 0, user_id: newBill.user_id, status: newBill.status, destination: newBill.destination, payment: newBill.payment})
        .then((response) => {
            this.setState({
                bills: [response.data, ...this.state.bills],
                isDisplayForm: false,
            });
        })
        .catch(error => console.log(error));
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
            get(`/bills/statusPage?pageNumber=${pageNumber}&pageSize=${this.state.currentPage}&sortBy=id`)
            .then((response) => {
                this.setState({
                    bills: response.data,
                });
            })
            .catch(error => console.log(error));
        }
        else
        {
            get(`/bills/fullNamePage?name=${this.state.search}&pageNumber=${pageNumber}&pageSize=${this.state.currentPage}&sortBy=id`)
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
        if (this.state.billdetails.length === 0)
        {
            toast.error('Kiểm tra lại chi tiết hóa đơn trước khi xác nhận!');
            return;
        }
        await put(`/bills/confirm/${id}`, {total: this.state.billCheckOut.total, user_id: this.state.billCheckOut.user_id, status: 'Done'})
        .then((response) => {
            if (response.status === 200)
            {
                this.props.history.push("/admin/bill");
            }
        })

        if (this.state.search === '')
        {
            get(`/bills/statusPage?pageNumber=${this.state.pageNumber}&pageSize=${this.state.currentPage}&sortBy=id`)
            .then((response) => {
                this.setState({
                    bills: response.data,
                });
            })
            .catch(error => console.log(error));
        }
        else
        {
            get(`/bills/fullNamePage?name=${this.state.search}&pageNumber=${this.state.pageNumber}&pageSize=${this.state.currentPage}&sortBy=id`)
            .then((response) => {
                this.setState({
                    bills: response.data,
                });
            })
            .catch(error => console.log(error));
        }
    }

    async handleSearch(e){
        e.preventDefault()
        await this.setState({
            search: e.target.value
        })
        if (this.state.search === '')
        {
            get("/bills/status")
            .then((response) => {
                if (response.status === 200)
                {
                    this.setState({
                        pageToTal: Math.ceil(response.data.length / this.state.currentPage)
                    })
                }
            })
            .catch(error => {console.log(error)})

            get(`/bills/statusPage?pageNumber=0&pageSize=${this.state.currentPage}&sortBy=id`)
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
                        pageToTal: Math.ceil(response.data / this.state.currentPage)
                    });
                }
            })
            .catch(error => {console.log(error)})

            get(`/bills/fullNamePage?name=${this.state.search}&pageNumber=0&pageSize=${this.state.currentPage}&sortBy=id`)
            .then((response) => {
                this.setState({
                    bills: response.data,
                });
            })
            .catch(error => console.log(error));
        }
    }

    handleSortInc = (e, key) => {
        e.preventDefault();
        if (key === 'id')
        {
            this.setState({
                bills: this.state.bills.sort((e1, e2) => (e1.id > e2.id ? 1 : -1))
            })
        }
        else if (key === 'total')
        {
            this.setState({
                bills: this.state.bills.sort((e1, e2) => (e1.total > e2.total ? 1 : -1))
            })
        }
        else if (key === 'create')
        {
            this.setState({
                bills: this.state.bills.sort((e1, e2) => (e1.createddate > e2.createddate ? 1 : -1))
            })
        }
        else if (key === 'confirm')
        {
            this.setState({
                bills: this.state.bills.sort((e1, e2) => (e1.checkout_date > e2.checkout_date ? 1 : -1))
            })
        }
    }

    handleSortDes = (e, key) => {
        e.preventDefault();
        if (key === 'id')
        {
            this.setState({
                bills: this.state.bills.sort((e1, e2) => (e2.id > e1.id ? 1 : -1))
            })
        }
        else if (key === 'total')
        {
            this.setState({
                bills: this.state.bills.sort((e1, e2) => (e2.total > e1.total ? 1 : -1))
            })
        }
        else if (key === 'create')
        {
            this.setState({
                bills: this.state.bills.sort((e1, e2) => (e2.createddate > e1.createddate ? 1 : -1))
            })
        }
        else if (key === 'confirm')
        {
            this.setState({
                bills: this.state.bills.sort((e1, e2) => (e2.checkout_date > e1.checkout_date ? 1 : -1))
            })
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
            { key: 'Hóa Đơn', content: 'Danh Sách Hóa Đơn', active: true }
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
                        Xóa Hóa Đơn
                    </ModalHeader>
                    <ModalBody>
                        <p>
                        Bạn có chắc chắn muốn xóa?
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={(e) => this.delBill(e, this.state.id)} className="btn-danger">Xóa</Button>
                        <Button onClick={(e) => this.onCloseFormDel(e)}>Hủy</Button>
                    </ModalFooter>
                </Modal>
                <Breadcrumb icon='right angle' sections={sections} size='large'/>
                <br/>
                {/* <button type="button" className="btn btn-primary" onClick={this.onToggleForm} style={{marginTop: '15px', marginBottom: '5px'}}>
                    <FontAwesomeIcon icon={faPlus} className="mr-2"/>{' '}
                    Tạo Hóa Đơn
                </button> */}
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
                            <th><b>Mã Hóa Đơn</b>{' '}<FontAwesomeIcon icon={faArrowCircleUp} className="sort-icon" onClick={(e) => this.handleSortInc(e, 'id')}/><FontAwesomeIcon icon={faArrowCircleDown} className="sort-icon" onClick={(e) => this.handleSortDes(e, 'id')}/></th>
                            <th><b>Tổng Tiền</b>{' '}<FontAwesomeIcon icon={faArrowCircleUp} className="sort-icon" onClick={(e) => this.handleSortInc(e, 'total')}/><FontAwesomeIcon icon={faArrowCircleDown} className="sort-icon" onClick={(e) => this.handleSortDes(e, 'total')}/></th>
                            <th><b>Thời Gian Lập</b>{' '}<FontAwesomeIcon icon={faArrowCircleUp} className="sort-icon" onClick={(e) => this.handleSortInc(e, 'create')}/><FontAwesomeIcon icon={faArrowCircleDown} className="sort-icon" onClick={(e) => this.handleSortDes(e, 'create')}/></th>
                            <th><b>Thời Gian Xác Nhận</b>{' '}<FontAwesomeIcon icon={faArrowCircleUp} className="sort-icon" onClick={(e) => this.handleSortInc(e, 'confirm')}/><FontAwesomeIcon icon={faArrowCircleDown} className="sort-icon" onClick={(e) => this.handleSortDes(e, 'confirm')}/></th>
                            <th><b>Khách Hàng</b></th>
                            <th><b>Thanh Toán</b></th>
                            <th><b>Trạng Thái</b></th>
                            {/* <th>Cập Nhập</th> */}
                            <th>Xóa</th>
                            <th>Chi Tiết</th>
                            <th>Xác Nhận</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.bills.map((b) => (
                                b.status !== 'Cancel' &&
                                <tr key={b.id}>
                                    <td>{b.id}</td>
                                    <td>{formatCurrency(b.total)}</td>
                                    <td>{b.createddate}</td>
                                    <td>{b.checkout_date}</td>
                                    <td>{b.user.name}</td>
                                    {b.payment === 'Cod' && <td>Tiền Mặt</td>}
                                    {b.payment === 'PayPal' && <td>PayPal</td>}
                                    <td>{b.status === 'Done' ? <Label color="teal">Hoàn Tất</Label> : <Label color="grey">Chờ Xác Nhận</Label>}</td>
                                    {/* <td> */}
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
                                        {/* {b.status !== 'Done' ? 
                                        <Link to={`/admin/bill/update/${b.id}`}>
                                            <button className="btn btn-success" disabled={b.status === 'Done'}>
                                                <FontAwesomeIcon icon={faEdit} className="mr-2"/>{' '}
                                            </button>
                                        </Link> : 
                                        <button className="btn btn-success" disabled={b.status === 'Done'}>
                                            <FontAwesomeIcon icon={faEdit} className="mr-2"/>{' '}
                                        </button>
                                        }
                                    </td> */}
                                    <td>
                                        <button onClick={(e) => this.onToggleFormDel(e, b.id)} className="btn btn-danger" disabled={b.status === 'Done'}>
                                            <FontAwesomeIcon icon={faTrash} className="mr-2" />{' '}
                                        </button>
                                    </td>
                                    <td>
                                        <Link to={`/admin/bill/${b.id}`}>
                                            <button className="btn btn-info">
                                                <FontAwesomeIcon icon={faReceipt} className="mr-2"/>{' '}
                                            </button>
                                        </Link>
                                    </td>
                                    <td>
                                        <Link to={`/admin/bill`} onClick={b.status === 'Done' ? (e) => e.preventDefault() : (event) => this.handleCheckOut(event, b.id, '')} className={b.status === 'Done' ? "disable-link" : ""}>
                                            <button className="btn btn-success" disabled={b.status === 'Done'}>
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
                        <ModalHeader toggle={this.onToggleForm}>Tạo Hóa Đơn</ModalHeader>
                        <ModalBody>
                            <Add onAdd={this.onAdd} onCloseForm={this.onCloseForm}/>
                        </ModalBody>
                        <ModalFooter>
                        </ModalFooter>
                    </Modal>
                </div>
                <ToastContainer position="top-center"
                    autoClose={2000}
                    hideProgressBar
                    newestOnTop={false}
                    closeOnClick={false}
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
					style={{width: '400px'}}/>
            </div>
        )
    }
}

export default withRouter(Bill);