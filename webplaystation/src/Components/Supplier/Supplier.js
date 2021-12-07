import React, { Component } from 'react';
import "./../Category/Category.css";
import {del, get, post} from "./../../Utils/httpHelper";
import { Link } from 'react-router-dom';
import Add from "./Add"
import { Modal, ModalHeader, ModalBody, ModalFooter, Pagination, PaginationItem, PaginationLink, Button} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus, faTrash, faArrowCircleDown, faArrowCircleUp } from '@fortawesome/free-solid-svg-icons';
import { Breadcrumb, Input } from 'semantic-ui-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class Supplier extends Component {
    state = {
        suppliers: [],
        isDisplayForm: false,
        isDisplayFormDel: false,
        pageNumber: 0,
        pageToTal: 0,
        msgDel: false,
        id: "",
        search: "",
        currentPage: 5
    }

    componentDidMount(){
        this.listSupplier();

        get(`/suppliers/page?pageNumber=0&pageSize=${this.state.currentPage}&sortBy=id`)
        .then((response) => {
            this.setState({
                suppliers: response.data
            });
        })
        .catch(error => console.log(error));
    }

    listSupplier()
    {
        get("/suppliers")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    pageToTal: Math.ceil(response.data.length / this.state.currentPage)
                })
            }
        })
        .catch(error => {console.log(error)})
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
                this.setState({suppliers: this.state.suppliers.filter(sup => sup.id !== id), isDisplayFormDel: false}, () => this.listSupplier())
            }
            else{
                this.setState({
                    msgDel: true
                })
            }
        })
        .catch(error => {toast.error('Máy của nhà cung cấp này vẫn đang được bán tại cửa hàng!')})
    }

    createSupplier(newSupplier){
        post(`/suppliers`, {name: newSupplier.name.trim(), address: newSupplier.address.trim(), phone: newSupplier.phone.trim()})
        .then((response) => {
            this.setState({
                suppliers: [response.data, ...this.state.suppliers ],
                isDisplayForm: false,
            }, () => {
                this.setState({suppliers: this.state.suppliers.slice(0, this.state.currentPage)});
                this.listSupplier();
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
        
        if (this.state.search === '')
        {
            get(`/suppliers/page?pageNumber=${pageNumber}&pageSize=${this.state.currentPage}&sortBy=id`)
            .then((response) => {
                this.setState({
                    suppliers: response.data,
                });
            })
            .catch(error => console.log(error));
        }
        else
        {
            get(`/suppliers/namePage?name=${this.state.search}&pageNumber=${pageNumber}&pageSize=${this.state.currentPage}&sortBy=id`)
            .then((response) => {
                this.setState({
                    suppliers: response.data,
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
            this.listSupplier();

            get(`/suppliers/page?pageNumber=0&pageSize=${this.state.currentPage}&sortBy=id`)
            .then((response) => {
                this.setState({
                    suppliers: response.data
                });
            })
            .catch(error => console.log(error));
        }
        else
        {
            get(`/suppliers/name?name=${this.state.search}`)
            .then((response) => {
                if (response.status === 200)
                {
                    this.setState({
                        pageToTal: Math.ceil(response.data / this.state.currentPage)
                    });
                }
            })
            .catch(error => {console.log(error)})

            get(`/suppliers/namePage?name=${this.state.search}&pageNumber=0&pageSize=${this.state.currentPage}&sortBy=id`)
            .then((response) => {
                this.setState({
                    suppliers: response.data,
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
                suppliers: this.state.suppliers.sort((e1, e2) => (e1.id > e2.id ? 1 : -1))
            })
        }
        else if (key === 'name')
        {
            this.setState({
                suppliers: this.state.suppliers.sort((e1, e2) => (e1.name > e2.name ? 1 : -1))
            })
        }
        else if (key === 'address')
        {
            this.setState({
                suppliers: this.state.suppliers.sort((e1, e2) => (e1.address > e2.address ? 1 : -1))
            })
        }
        else if (key === 'phone')
        {
            this.setState({
                suppliers: this.state.suppliers.sort((e1, e2) => (e1.phone > e2.phone ? 1 : -1))
            })
        }
    }

    handleSortDes = (e, key) => {
        e.preventDefault();
        if (key === 'id')
        {
            this.setState({
                suppliers: this.state.suppliers.sort((e1, e2) => (e2.id > e1.id ? 1 : -1))
            })
        }
        else if (key === 'name')
        {
            this.setState({
                suppliers: this.state.suppliers.sort((e1, e2) => (e2.name > e1.name ? 1 : -1))
            })
        }
        else if (key === 'address')
        {
            this.setState({
                suppliers: this.state.suppliers.sort((e1, e2) => (e2.address > e1.address ? 1 : -1))
            })
        }
        else if (key === 'phone')
        {
            this.setState({
                suppliers: this.state.suppliers.sort((e1, e2) => (e2.phone > e1.phone ? 1 : -1))
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
            { key: 'Nhà Cung Cấp', content: 'Danh Sách Nhà Cung Cấp', active: true }
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
                        Xóa Nhà Cung Cấp
                    </ModalHeader>
                    <ModalBody>
                        <p>
                        Bạn có chắc chắn muốn xóa?
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={(e) => this.delSupplier(e, this.state.id)} className="btn-danger">Xóa</Button>
                        <Button onClick={(e) => this.onCloseFormDel(e)}>Hủy</Button>
                    </ModalFooter>
                </Modal>
                <Breadcrumb icon='right angle' sections={sections} size='large'/>
                <br/>
                <button type="button" className="btn btn-primary" onClick={this.onToggleForm} style={{marginTop: '30px'}}>
                    <FontAwesomeIcon icon={faPlus} className="mr-2"/>{' '}
                    Thêm Nhà Cung Cấp
                </button>
                <Input
                    style={{marginLeft: '87%'}}
                    placeholder="Tên nhà cung cấp..."
                    value={this.state.search}
                    onChange={(e) => this.handleSearch(e)}
                    icon="search"
                />
                <table id="table">
                    <thead>
                        <tr>
                            <th><b>ID</b>{' '}<FontAwesomeIcon icon={faArrowCircleUp} className="sort-icon" onClick={(e) => this.handleSortInc(e, 'id')}/><FontAwesomeIcon icon={faArrowCircleDown} className="sort-icon" onClick={(e) => this.handleSortDes(e, 'id')}/></th>
                            <th><b>Tên</b>{' '}<FontAwesomeIcon icon={faArrowCircleUp} className="sort-icon" onClick={(e) => this.handleSortInc(e, 'name')}/><FontAwesomeIcon icon={faArrowCircleDown} className="sort-icon" onClick={(e) => this.handleSortDes(e, 'name')}/></th>
                            <th><b>Địa Chỉ</b>{' '}<FontAwesomeIcon icon={faArrowCircleUp} className="sort-icon" onClick={(e) => this.handleSortInc(e, 'address')}/><FontAwesomeIcon icon={faArrowCircleDown} className="sort-icon" onClick={(e) => this.handleSortDes(e, 'address')}/></th>
                            <th><b>Số Điện Thoại</b>{' '}<FontAwesomeIcon icon={faArrowCircleUp} className="sort-icon" onClick={(e) => this.handleSortInc(e, 'phone')}/><FontAwesomeIcon icon={faArrowCircleDown} className="sort-icon" onClick={(e) => this.handleSortDes(e, 'phone')}/></th>
                            <th>Cập Nhật</th>
                            <th>Xóa</th>
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
                        <ModalHeader toggle={this.onToggleForm}>Thêm Nhà Cung Cấp</ModalHeader>
                        <ModalBody>
                            <Add onAdd={this.onAdd} onCloseForm={this.onCloseForm}/>
                        </ModalBody>
                        <ModalFooter>
                        </ModalFooter>
                    </Modal>
                </div>
                <ToastContainer position="top-center"
                    autoClose={2500}
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
