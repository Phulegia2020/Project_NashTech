import React, { Component } from 'react'
import "./../Category/Category.css";
import {del, get, post} from "./../../Utils/httpHelper";
import {formatCurrency} from "./../../Utils/Utils";
import { Link } from 'react-router-dom';
import Add from "./Add"
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faInfo, faPlus, faTrash, faArrowCircleDown, faArrowCircleUp } from '@fortawesome/free-solid-svg-icons';
import { Label, Breadcrumb } from 'semantic-ui-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        // .catch((error) => {alert('The Place Order had details or approved by import card. Can not delete!')});
        .catch((error) => {toast.error('Phiếu đặt này đã được lập chi tiết!')});
    }

    createPlaceOrder(newPlaceOrder){
        post(`/placeorders`, {total: 0, user_id: newPlaceOrder.user_id, supplier_id: newPlaceOrder.supplier_id})
        .then((response) => {
            //window.location.reload();
            if (response.status === 200)
            {
                this.setState({
                    placeorders: [response.data, ...this.state.placeorders],
                    isDisplayForm: false,
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

    handleSortInc = (e) => {
        e.preventDefault();
        //this.state.categories.sort((e1, e2) => (e1.id > e2.id ? 1 : -1));
        this.setState({
            placeorders: this.state.placeorders.sort((e1, e2) => (e1.id > e2.id ? 1 : -1))
        })
        // console.log('sort');
    }

    handleSortDes = (e) => {
        e.preventDefault();
        //this.state.categories.sort((e1, e2) => (e1.id > e2.id ? 1 : -1));
        this.setState({
            placeorders: this.state.placeorders.sort((e1, e2) => (e2.id > e1.id ? 1 : -1))
        })
        // console.log('sort');
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
                <table id="table">
                    <thead>
                        <tr>
                            <th><b>Mã Phiếu Đặt</b>{' '}<FontAwesomeIcon icon={faArrowCircleUp} className="sort-icon" onClick={(e) => this.handleSortInc(e)}/><FontAwesomeIcon icon={faArrowCircleDown} className="sort-icon" onClick={(e) => this.handleSortDes(e)}/></th>
                            <th><b>Tổng Tiền</b></th>
                            <th><b>Thời Gian Lập</b></th>
                            <th><b>Nhân Viên</b></th>
                            <th><b>Nhà Cung Cấp</b></th>
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
                                    <td>{po.user.name}</td>
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
