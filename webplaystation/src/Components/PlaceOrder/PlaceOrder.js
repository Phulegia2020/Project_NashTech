import React, { Component } from 'react'
import "./../Category/Category.css";
import {del, get, post} from "./../../Utils/httpHelper";
import {formatCurrency} from "./../../Utils/Utils";
import { Link } from 'react-router-dom';
import Add from "./Add"
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus, faTrash, faArrowCircleDown, faArrowCircleUp, faReceipt } from '@fortawesome/free-solid-svg-icons';
import { Label, Breadcrumb, Input } from 'semantic-ui-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class PlaceOrder extends Component {
    state = {
        placeorders: [],
        isDisplayForm: false,
        isDisplayFormDel: false,
        pageNumber: 0,
        pageToTal: 0,
        id: "",
        search: "",
        currentPage: 8
    }

    componentDidMount(){
        this.listPlaceOrder();

        get(`/placeorders/statusPage?pageNumber=0&pageSize=${this.state.currentPage}&sortBy=id`)
        .then((response) => {
            this.setState({
                placeorders: response.data,
            });
        })
        .catch(error => console.log(error));
    }

    listPlaceOrder()
    {
        get("/placeorders/status")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    pageToTal: Math.ceil(response.data / this.state.currentPage)
                })
            }
        })
        .catch(error => {console.log(error)})
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
            this.setState({placeorders: this.state.placeorders.filter(b => b.id !== id), isDisplayFormDel: false}, () => this.listPlaceOrder())
        })
        .catch((error) => {toast.error('Phiếu đặt này đã được lập chi tiết!')});
    }

    createPlaceOrder(newPlaceOrder){
        post(`/placeorders`, {total: 0, user_id: newPlaceOrder.user_id, supplier_id: newPlaceOrder.supplier_id})
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    placeorders: [response.data, ...this.state.placeorders],
                    isDisplayForm: false,
                }, () => {
                    this.setState({placeorders: this.state.placeorders.slice(0, this.state.currentPage)});
                    this.listPlaceOrder();
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
        
        if (this.state.search === '')
        {
            get(`/placeorders/statusPage?pageNumber=${pageNumber}&pageSize=${this.state.currentPage}&sortBy=id`)
            .then((response) => {
                this.setState({
                    placeorders: response.data,
                });
            })
            .catch(error => console.log(error));
        }
        else
        {
            get(`/placeorders/searchPage?search=${this.state.search}&pageNumber=0&pageSize=${this.state.currentPage}&sortBy=id`)
            .then((response) => {
                this.setState({
                    placeorders: response.data,
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
                placeorders: this.state.placeorders.sort((e1, e2) => (e1.id > e2.id ? 1 : -1))
            })
        }
        else if (key === 'total')
        {
            this.setState({
                placeorders: this.state.placeorders.sort((e1, e2) => (e1.total > e2.total ? 1 : -1))
            })
        }
        else if (key === 'time')
        {
            this.setState({
                placeorders: this.state.placeorders.sort((e1, e2) => (e1.createddate > e2.createddate ? 1 : -1))
            })
        }
        else if (key === 'sup')
        {
            this.setState({
                placeorders: this.state.placeorders.sort((e1, e2) => (e1.supplier.name > e2.supplier.name ? 1 : -1))
            })
        }
    }

    handleSortDes = (e, key) => {
        e.preventDefault();
        if (key === 'id')
        {
            this.setState({
                placeorders: this.state.placeorders.sort((e1, e2) => (e2.id > e1.id ? 1 : -1))
            })
        }
        else if (key === 'total')
        {
            this.setState({
                placeorders: this.state.placeorders.sort((e1, e2) => (e2.total > e1.total ? 1 : -1))
            })
        }
        else if (key === 'time')
        {
            this.setState({
                placeorders: this.state.placeorders.sort((e1, e2) => (e2.createddate > e1.createddate ? 1 : -1))
            })
        }
        else if (key === 'sup')
        {
            this.setState({
                placeorders: this.state.placeorders.sort((e1, e2) => (e2.supplier.name > e1.supplier.name ? 1 : -1))
            })
        }
    }

    async handleSearch(e){
        e.preventDefault()
        await this.setState({
            search: e.target.value
        })
        if (this.state.search === '')
        {
            this.listPlaceOrder();

            get(`/placeorders/statusPage?pageNumber=0&pageSize=${this.state.currentPage}&sortBy=id`)
            .then((response) => {
                this.setState({
                    placeorders: response.data,
                });
            })
            .catch(error => console.log(error));
        }
        else
        {
            get(`/placeorders/search?search=${this.state.search}`)
            .then((response) => {
                if (response.status === 200)
                {
                    this.setState({
                        pageToTal: Math.ceil(response.data / this.state.currentPage)
                    })
                }
            })
            .catch(error => {console.log(error)})

            get(`/placeorders/searchPage?search=${this.state.search}&pageNumber=0&pageSize=${this.state.currentPage}&sortBy=id`)
            .then((response) => {
                this.setState({
                    placeorders: response.data,
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
            { key: 'Phiếu Đặt', content: 'Danh Sách Phiếu Đặt', active: true }
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
                        Xóa Phiếu Đặt
                    </ModalHeader>
                    <ModalBody>
                        <p>
                        Bạn có chắc chắn muốn xóa?
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={(e) => this.delPlaceOrder(e, this.state.id)} className="btn-danger">Xóa</Button>
                        <Button onClick={(e) => this.onCloseFormDel(e)}>Hủy</Button>
                    </ModalFooter>
                </Modal>
                <Breadcrumb icon='right angle' sections={sections} size='large'/>
                <br/>
                <button type="button" className="btn btn-primary" onClick={this.onToggleForm} style={{marginTop: '30px'}}>
                    <FontAwesomeIcon icon={faPlus} className="mr-2"/>{' '}
                    Tạo Phiết Đặt
                </button>
                <Input
                    style={{marginLeft: '87%'}}
                    placeholder="Mã Phiếu Đặt..."
                    value={this.state.search}
                    onChange={(e) => this.handleSearch(e)}
                    icon="search"
                    type='number'
                />
                <table id="table">
                    <thead>
                        <tr>
                            <th><b>Mã Phiếu Đặt</b>{' '}<FontAwesomeIcon icon={faArrowCircleUp} className="sort-icon" onClick={(e) => this.handleSortInc(e, 'id')}/><FontAwesomeIcon icon={faArrowCircleDown} className="sort-icon" onClick={(e) => this.handleSortDes(e, 'id')}/></th>
                            <th><b>Tổng Tiền</b>{' '}<FontAwesomeIcon icon={faArrowCircleUp} className="sort-icon" onClick={(e) => this.handleSortInc(e, 'total')}/><FontAwesomeIcon icon={faArrowCircleDown} className="sort-icon" onClick={(e) => this.handleSortDes(e, 'total')}/></th>
                            <th><b>Thời Gian Lập</b>{' '}<FontAwesomeIcon icon={faArrowCircleUp} className="sort-icon" onClick={(e) => this.handleSortInc(e, 'time')}/><FontAwesomeIcon icon={faArrowCircleDown} className="sort-icon" onClick={(e) => this.handleSortDes(e, 'time')}/></th>
                            {/* <th><b>Nhân Viên</b></th> */}
                            <th><b>Nhà Cung Cấp</b>{' '}<FontAwesomeIcon icon={faArrowCircleUp} className="sort-icon" onClick={(e) => this.handleSortInc(e, 'sup')}/><FontAwesomeIcon icon={faArrowCircleDown} className="sort-icon" onClick={(e) => this.handleSortDes(e, 'sup')}/></th>
                            <th><b>Trạng Thái</b></th>
                            <th>Cập Nhật</th>
                            <th>Xóa</th>
                            <th>Chi Tiết</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.placeorders.map((po) => (
                                po.status !== 'Cancel' &&
                                <tr key={po.id}>
                                    <td>{po.id}</td>
                                    <td>{formatCurrency(po.total)}</td>
                                    <td>{po.createddate}</td>
                                    {/* <td>{po.user.name}</td> */}
                                    <td>{po.supplier.name}</td>
                                    {po.status === 'Done' && (<td><Label color="teal">Hoàn Tất</Label></td>)}
                                    {po.status === 'Waiting' && (<td><Label color="grey">Chờ Xử Lý</Label></td>)}
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
                                    <td>
                                        <button onClick={(e) => this.onToggleFormDel(e, po.id)} className="btn btn-danger" disabled={po.status === "Done"}>
                                            <FontAwesomeIcon icon={faTrash} className="mr-2"/>{' '}
                                        </button>
                                    </td>
                                    <td>
                                        <Link to={`/admin/placeorder/${po.id}`}>
                                            <button className="btn btn-info">
                                                <FontAwesomeIcon icon={faReceipt} className="mr-2"/>{' '}
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
                        <ModalHeader toggle={this.onToggleForm}>Tạo Phiếu Đặt</ModalHeader>
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
                    pauseOnHover/>
            </div>
        )
    }
}
