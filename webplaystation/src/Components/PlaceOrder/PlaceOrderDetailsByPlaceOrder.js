import React, { Component } from 'react'
import { get, del, post } from '../../Utils/httpHelper'
import { formatCurrency, formatQuantity } from '../../Utils/Utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import Add from '../PlaceOrderDetails/Add';
import { withRouter } from "react-router";
import "../ImportCard/import.css";

class PlaceOrderDetailsByPlaceOrder extends Component {
    state = {
        id: this.props.match.params.id,
        placeorderdetails: [],
        placeorder: {},
        isDisplayForm: false,
        isDisplayFormDel: false,
        iddel: {},
        pageNumber: 0,
        pageToTal: 0,
        currentPage: 5
    }

    componentDidMount(){
        this.listPlaceOrderDetail();

        get(`/placeorderDetails/placeOrderPage/${this.state.id}?pageNumber=0&pageSize=${this.state.currentPage}&sortBy=id`)
        .then((response) => {
            this.setState({
                placeorderdetails: response.data
            });
        })
        .catch(error => console.log(error));

        get(`/placeorders/${this.state.id}`)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    placeorder: response.data
                })
            }
        })
    }

    listPlaceOrderDetail()
    {
        get(`/placeorderDetails/placeOrder/${this.state.id}`)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    pageToTal: Math.ceil(response.data.length / this.state.currentPage)
                })
            }
        })
    }

    delPlaceOrderDetail = (e, id) =>
    {
        e.preventDefault();
        del(`/placeorderDetails/${id.placeorder_id}-${id.product_id}`)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({placeorderdetails: this.state.placeorderdetails.filter(b => `${b.placeorder_id}-${b.product_id}` !== `${id.placeorder_id}-${id.product_id}`), isDisplayFormDel: false},
                                () => this.listPlaceOrderDetail())
            }
        })
        .catch(error => {console.log(error)})
    }

    createPlaceOrderDetail(newPlaceOrderDetail){
        post(`/placeorderDetails`, {quantity: newPlaceOrderDetail.quantity, price: newPlaceOrderDetail.price, product_id: newPlaceOrderDetail.product_id, placeorder_id: newPlaceOrderDetail.placeorder_id})
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    placeorderdetails: [...this.state.placeorderdetails, response.data],
                    isDisplayForm: false,
                }, () => {
                    this.setState({placeorderdetails: this.state.placeorderdetails.slice(0, this.state.currentPage)});
                    this.listPlaceOrderDetail();
                })
            }
        })
        .catch((error) => {alert('Phiếu đặt đã có máy này!')});
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
        this.createPlaceOrderDetail(data);
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
        
        get(`/placeorderDetails/placeOrderPage/${this.state.id}?pageNumber=${pageNumber}&pageSize=${this.state.currentPage}&sortBy=id`)
        .then((response) => {
            this.setState({
                placeorderdetails: response.data,
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
            <div className="list-details">
                <Modal
                    isOpen={this.state.isDisplayFormDel}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    toggle={this.onToggleFormDel}
                    >
                    <ModalHeader>
                        Xóa Chi Tiết
                    </ModalHeader>
                    <ModalBody>
                        <p>
                        Bạn có chắc chắn muốn xóa?
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={(e) => this.delPlaceOrderDetail(e, this.state.iddel)} className="btn-danger">Xóa</Button>
                        <Button onClick={(e) => this.onCloseFormDel(e)}>Hủy</Button>
                    </ModalFooter>
                </Modal>
                {this.state.placeorder.status === 'Waiting' && <button type="button" className="btn btn-primary" onClick={this.onToggleForm}>
                    <FontAwesomeIcon icon={faPlus} className="mr-2"/>{' '}
                    Tạo Chi Tiết Mới
                </button>}
                <h3>Danh Sách Chi Tiết Phiếu Đặt {this.state.id}</h3>
                <table id="table">
                    <thead>
                        <tr>
                            <th><b>No.</b></th>
                            <th><b>Hình Ảnh</b></th>
                            <th><b>Máy</b></th>
                            <th><b>Số Lượng</b></th>
                            <th><b>Giá</b></th>
                            {this.state.placeorder.status === 'Waiting' && <th>Cập Nhật</th>}
                            {this.state.placeorder.status === 'Waiting' && <th>Xóa</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.placeorderdetails.map((po, index) => (
                                <tr key={index}>
                                    <td>{this.state.pageNumber*this.state.currentPage + index + 1}</td>
                                    <td>
                                        <img src={po.productImg || "http://via.placeholder.com/300"} alt="" height="75px"></img>
                                    </td>
                                    <td>{po.productName}</td>
                                    <td>{formatQuantity(po.quantity)}</td>
                                    <td>{formatCurrency(po.price)}</td>
                                    {this.state.placeorder.status === 'Waiting' && <td>
                                        <Link to={`/admin/placeorderDetails/update/${po.placeorder_id}-${po.product_id}`} onClick={this.state.placeorder.status === 'Done' ? (e) => e.preventDefault() : ''} className={this.state.placeorder.status === 'Done' ? "disable-link" : ""}>
                                            <button className="btn btn-success" disabled={this.state.placeorder.status === 'Done'}>
                                            <FontAwesomeIcon icon={faEdit} className="mr-2"/>{' '}
                                                
                                            </button>
                                        </Link>
                                    </td>}
                                    {this.state.placeorder.status === 'Waiting' && <td><button onClick={(e) => this.onToggleFormDel(e, po)} className="btn btn-danger" disabled={this.state.placeorder.status === 'Done'}>
                                        <FontAwesomeIcon icon={faTrash} className="mr-2"/>{' '}
                                        
                                        </button>
                                    </td>}
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
                        <ModalHeader toggle={this.onToggleForm}>Tạo Chi Tiết</ModalHeader>
                        <ModalBody>
                            <Add onAdd={this.onAdd} onCloseForm={this.onCloseForm} placeorder={this.state.id} placeorderDet={this.state.placeorderdetails}/>
                        </ModalBody>
                        <ModalFooter>
                        </ModalFooter>
                    </Modal>
                </div>
            </div>
        )
    }
}

export default withRouter(PlaceOrderDetailsByPlaceOrder);