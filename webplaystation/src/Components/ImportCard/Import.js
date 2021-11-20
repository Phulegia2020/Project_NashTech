import React, { Component } from 'react'
import "./../Category/Category.css";
import {del, get, post, put} from "./../../Utils/httpHelper";
import {formatCurrency} from "./../../Utils/Utils";
import { Link } from 'react-router-dom';
import Add from "./Add"
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faInfo, faPlus, faTrash, faCheck, faArrowCircleUp, faArrowCircleDown, faReceipt } from '@fortawesome/free-solid-svg-icons';
import { Label, Breadcrumb, Input } from 'semantic-ui-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class Import extends Component {
    state = {
        imports: [],
        isDisplayForm: false,
        isDisplayFormDel: false,
        pageNumber: 0,
        pageToTal: 0,
        importConfirm: {},
        placeorderdetails: [],
        id: "",
        search: "",
        currentPage: 8
    }

    componentDidMount(){
        get("/imports/status")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    pageToTal: Math.ceil(response.data / this.state.currentPage)
                })
            }
        })
        .catch(error => {console.log(error)})

        get(`/imports/statusPage?pageNumber=0&pageSize=${this.state.currentPage}&sortBy=id`)
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
        // .catch(error => {alert('This Import had details. Can not Delete!')})
        .catch(error => {toast.error('Phiếu nhập đã được lập chi tiết!')})
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
            // alert('The Place Order has not details');
            toast.error('Phiếu đặt này chưa được lập chi tiết!');
            return;
        }
        post(`/imports`, {total: 0, user_id: newImport.user_id, placeOrder_id: newImport.placeorder_id})
        .then((response) => {
            //window.location.reload();
            this.setState({
                // imports: [...this.state.imports, response.data],
                imports: [response.data, ...this.state.imports],
                isDisplayForm: false,
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
        
        if (this.state.search === '')
        {
            get(`/imports/statusPage?pageNumber=${pageNumber}&pageSize=${this.state.currentPage}&sortBy=id`)
            .then((response) => {
                this.setState({
                    imports: response.data,
                });
            })
            .catch(error => console.log(error));
        }
        else
        {
            get(`/imports/searchPage?search=${this.state.search}&pageNumber=0&pageSize=${this.state.currentPage}&sortBy=id`)
            .then((response) => {
                this.setState({
                    imports: response.data,
                });
            })
            .catch(error => console.log(error));
        }
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
        await put(`/imports/confirm/${id}`, {total: this.state.importConfirm.total, user_id: this.state.importConfirm.user_id, placeOrder_id: this.state.importConfirm.placeorder_id})
        .then((response) => {
            if (response.status === 200)
            {
                // window.location.href="/admin/import";
            }
        })
        .catch((error)=> {})

        get(`/imports/statusPage?pageNumber=${this.state.pageNumber}&pageSize=${this.state.currentPage}&sortBy=id`)
        .then((response) => {
            this.setState({
                imports: response.data,
            });
        })
        .catch(error => console.log(error));
    }

    handleSortInc = (e, key) => {
        e.preventDefault();
        //this.state.categories.sort((e1, e2) => (e1.id > e2.id ? 1 : -1));
        if (key === 'id')
        {
            this.setState({
                imports: this.state.imports.sort((e1, e2) => (e1.id > e2.id ? 1 : -1))
            })
        }
        else if (key === 'total')
        {
            this.setState({
                imports: this.state.imports.sort((e1, e2) => (e1.total > e2.total ? 1 : -1))
            })
        }
        else if (key === 'time')
        {
            this.setState({
                imports: this.state.imports.sort((e1, e2) => (e1.createddate > e2.createddate ? 1 : -1))
            })
        }
        else if (key === 'poid')
        {
            this.setState({
                imports: this.state.imports.sort((e1, e2) => (e1.placeOrder.id > e2.placeOrder.id ? 1 : -1))
            })
        }
        // console.log('sort');
    }

    handleSortDes = (e, key) => {
        e.preventDefault();
        //this.state.categories.sort((e1, e2) => (e1.id > e2.id ? 1 : -1));
        if (key === 'id')
        {
            this.setState({
                imports: this.state.imports.sort((e1, e2) => (e2.id > e1.id ? 1 : -1))
            })
        }
        else if (key === 'total')
        {
            this.setState({
                imports: this.state.imports.sort((e1, e2) => (e2.total > e1.total ? 1 : -1))
            })
        }
        else if (key === 'time')
        {
            this.setState({
                imports: this.state.imports.sort((e1, e2) => (e2.createddate > e1.createddate ? 1 : -1))
            })
        }
        else if (key === 'poid')
        {
            this.setState({
                imports: this.state.imports.sort((e1, e2) => (e2.placeOrder.id > e1.placeOrder.id ? 1 : -1))
            })
        }
        // console.log('sort');
    }

    async handleSearch(e){
        e.preventDefault()
        await this.setState({
            search: e.target.value
        })
        if (this.state.search === '')
        {
            get("/imports/status")
            .then((response) => {
                if (response.status === 200)
                {
                    this.setState({
                        pageToTal: Math.ceil(response.data / this.state.currentPage)
                    })
                }
            })
            .catch(error => {console.log(error)})

            get(`/imports/statusPage?pageNumber=0&pageSize=${this.state.currentPage}&sortBy=id`)
            .then((response) => {
                this.setState({
                    imports: response.data,
                });
            })
            .catch(error => console.log(error));
        }
        else
        {
            get(`/imports/search?search=${this.state.search}`)
            .then((response) => {
                if (response.status === 200)
                {
                    this.setState({
                        pageToTal: Math.ceil(response.data / this.state.currentPage)
                    })
                }
            })
            .catch(error => {console.log(error)})

            get(`/imports/searchPage?search=${this.state.search}&pageNumber=0&pageSize=${this.state.currentPage}&sortBy=id`)
            .then((response) => {
                this.setState({
                    imports: response.data,
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
                        Xóa Phiếu Nhập
                    </ModalHeader>
                    <ModalBody>
                        <p>
                        Bạn có chắc chắn muốn xóa?
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={(e) => this.delImport(e, this.state.id)} className="btn-danger">Xóa</Button>
                        <Button onClick={(e) => this.onCloseFormDel(e)}>Hủy</Button>
                    </ModalFooter>
                </Modal>
                <Breadcrumb icon='right angle' sections={sections} size='large'/>
                <br/>
                <button type="button" className="btn btn-primary" onClick={this.onToggleForm} style={{marginTop: '30px'}}>
                    <FontAwesomeIcon icon={faPlus} className="mr-2"/>{' '}
                    Tạo Phiếu Nhập
                </button>
                <Input
                    style={{marginLeft: '100rem'}}
                    placeholder="Mã Phiếu Nhập..."
                    value={this.state.search}
                    onChange={(e) => this.handleSearch(e)}
                    icon="search"
                />
                <table id="table">
                    <thead>
                        <tr>
                            <th><b>Mã Phiếu Nhập</b>{' '}<FontAwesomeIcon icon={faArrowCircleUp} className="sort-icon" onClick={(e) => this.handleSortInc(e, 'id')}/><FontAwesomeIcon icon={faArrowCircleDown} className="sort-icon" onClick={(e) => this.handleSortDes(e, 'id')}/></th>
                            <th><b>Tổng Tiền</b>{' '}<FontAwesomeIcon icon={faArrowCircleUp} className="sort-icon" onClick={(e) => this.handleSortInc(e, 'total')}/><FontAwesomeIcon icon={faArrowCircleDown} className="sort-icon" onClick={(e) => this.handleSortDes(e, 'total')}/></th>
                            <th><b>Thời Gian</b>{' '}<FontAwesomeIcon icon={faArrowCircleUp} className="sort-icon" onClick={(e) => this.handleSortInc(e, 'time')}/><FontAwesomeIcon icon={faArrowCircleDown} className="sort-icon" onClick={(e) => this.handleSortDes(e, 'time')}/></th>
                            <th><b>Phiếu Đặt</b>{' '}<FontAwesomeIcon icon={faArrowCircleUp} className="sort-icon" onClick={(e) => this.handleSortInc(e, 'poid')}/><FontAwesomeIcon icon={faArrowCircleDown} className="sort-icon" onClick={(e) => this.handleSortDes(e, 'poid')}/></th>
                            <th><b>Nhân Viên</b></th>
                            <th><b>Trạng Thái</b></th>
                            {/* <th>Cập Nhật</th> */}
                            <th>Xóa</th>
                            <th>Chi Tiết</th>
                            <th>Xác Nhận</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.imports.map((imp) => (
                                imp.status !== 'Cancel' &&
                                <tr key={imp.id}>
                                    <td>{imp.id}</td>
                                    <td>{formatCurrency(imp.total)}</td>
                                    <td>{imp.createddate}</td>
                                    <td>{imp.placeOrder.id}</td>
                                    <td>{imp.user.name}</td>
                                    {imp.status === 'Done' && (<td><Label color="teal">Hoàn Tất</Label></td>)}
                                    {imp.status === 'Waiting' && (<td><Label color="grey">Chờ Xác Nhận</Label></td>)}
                                    {/* <td>
                                        <Link to={`/admin/import/update/${imp.id}`} onClick={imp.status !== 'Waiting' ? (e) => e.preventDefault() : ''} className={imp.status !== 'Waiting' ? "disable-link" : ""}>
                                            <button className="btn btn-success" disabled={imp.status !== 'Waiting'}>
                                            <FontAwesomeIcon icon={faEdit} className="mr-2"/>{' '}
                                                
                                            </button>
                                        </Link>
                                    </td> */}
                                    <td><button onClick={(e) => this.onToggleFormDel(e, imp.id)} className="btn btn-danger" disabled={imp.status !== 'Waiting'}>
                                        <FontAwesomeIcon icon={faTrash} className="mr-2"/>{' '}
                                        
                                        </button>
                                    </td>
                                    <td>
                                        <Link to={`/admin/import/${imp.id}`}>
                                            <button className="btn btn-info">
                                            <FontAwesomeIcon icon={faReceipt} className="mr-2"/>{' '}
                                                
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
                        <ModalHeader toggle={this.onToggleForm}>Tạo Phiếu Nhập</ModalHeader>
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
