import React, {Component} from 'react';
import "./Category.css";
import {del, get, post} from "./../../Utils/httpHelper";
import { Link } from 'react-router-dom';
import Add from "./Add"
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleDown, faArrowCircleUp, faEdit, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Breadcrumb, Input } from 'semantic-ui-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class Category extends Component {
    state = {
        categories: [],
        isDisplayForm: false,
        isDisplayFormDel: false,
        iddel: '',
        pageNumber: 0,
        pageToTal: 0,
        msgDel: false,
        search: "",
        currentPage: 5
    }

    componentDidMount(){
        get("/categories")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    pageToTal: Math.ceil(response.data.length / this.state.currentPage)
                })
            }
        })
        .catch(error => {console.log(error)})

        get(`/categories/page?pageNumber=0&pageSize=${this.state.currentPage}&sortBy=id`)
        .then((response) => {
            this.setState({
                categories: response.data
            });
        })
        .catch(error => console.log(error));
    }

    find(id){
        get(`/categories/${id}`)
        .then((response) => {
            if (response.status === 200)
            {
            }
        })
    }

    delCategory(e, id)
    {
        e.preventDefault();
        del(`/categories/${id}`)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({categories: this.state.categories.filter(cate => cate.id !== id), isDisplayFormDel: false})
            }
            else{
                this.setState({
                    msgDel: true
                })
            }
        })
        // .catch(error => {alert('This category had products. Can not delete!')})
        .catch(error => toast.error('Không thể xóa loại máy vẫn đang được kinh doanh!'))
    }

    createCategory(newCategory){
        post(`/categories`, {name: newCategory.name.trim(), description: newCategory.description.trim()})
        .then((response) => {
            //window.location.reload();
            this.setState({
                categories: [response.data, ...this.state.categories],
                isDisplayForm: false,
                //pageToTal: Math.ceil(this.state.categories.length / 5)
            });
        });
    }

    onAdd = (data) => {
        console.log(data);
        this.createCategory(data);
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
            get(`/categories/page?pageNumber=${pageNumber}&pageSize=${this.state.currentPage}&sortBy=id`)
            .then((response) => {
                this.setState({
                    categories: response.data,
                });
            })
            .catch(error => console.log(error));
        }
        else
        {
            get(`/categories/namePage?name=${this.state.search}&pageNumber=${pageNumber}&pageSize=${this.state.currentPage}&sortBy=id`)
            .then((response) => {
                this.setState({
                    categories: response.data,
                });
            })
            .catch(error => console.log(error));
        }
    }

    // handleDelete(id){
    //     this.setState({
    //         isDisplayFormDel: !this.state.isDisplayFormDel,
    //         iddel: id
    //     })
    // }

    async handleSearch(e){
        e.preventDefault()
        await this.setState({
            search: e.target.value
        })
        if (this.state.search === '')
        {
            get("/categories")
            .then((response) => {
                if (response.status === 200)
                {
                    this.setState({
                        pageToTal: Math.ceil(response.data.length / this.state.currentPage)
                    })
                }
            })
            .catch(error => {console.log(error)})

            get(`/categories/page?pageNumber=0&pageSize=${this.state.currentPage}&sortBy=id`)
            .then((response) => {
                this.setState({
                    categories: response.data
                });
            })
            .catch(error => console.log(error));
        }
        else
        {
            get(`/categories/name?name=${this.state.search}`)
            .then((response) => {
                if (response.status === 200)
                {
                    this.setState({
                        pageToTal: Math.ceil(response.data / this.state.currentPage)
                    });
                }
            })
            .catch(error => {console.log(error)})

            get(`/categories/namePage?name=${this.state.search}&pageNumber=0&pageSize=${this.state.currentPage}&sortBy=id`)
            .then((response) => {
                this.setState({
                    categories: response.data,
                });
            })
            .catch(error => console.log(error));
        }
    }

    handleSortInc = (e, key) => {
        e.preventDefault();
        //this.state.categories.sort((e1, e2) => (e1.id > e2.id ? 1 : -1));
        if (key === 'id')
        {
            this.setState({
                categories: this.state.categories.sort((e1, e2) => (e1.id > e2.id ? 1 : -1))
            })
        }
        else if (key === 'name')
        {
            this.setState({
                categories: this.state.categories.sort((e1, e2) => (e1.name > e2.name ? 1 : -1))
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
                categories: this.state.categories.sort((e1, e2) => (e2.id > e1.id ? 1 : -1))
            })
        }
        else if (key === 'name')
        {
            this.setState({
                categories: this.state.categories.sort((e1, e2) => (e2.name > e1.name ? 1 : -1))
            })
        }
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
            { key: 'Loại Sản Phẩm', content: 'Loại Sản Phẩm', active: true }
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
                        Xóa Loại Máy
                    </ModalHeader>
                    <ModalBody>
                        <p>
                        Bạn có chắc chắn muốn xóa?
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={(e) => this.delCategory(e, this.state.iddel)} className="btn-danger">Xóa</Button>
                        <Button onClick={(e) => this.onCloseFormDel(e)}>Hủy</Button>
                    </ModalFooter>
                </Modal>
                <Breadcrumb icon='right angle' sections={sections} size='large'/>
                <br/>
                <button type="button" className="btn btn-primary" onClick={this.onToggleForm} style={{marginTop: '30px'}}>
                    <FontAwesomeIcon icon={faPlus} className="mr-2"/>{' '}
                    Thêm Loại Mới
                </button>
                <Input
                    style={{marginLeft: '100rem'}}
                    placeholder="Tên loại..."
                    value={this.state.search}
                    onChange={(e) => this.handleSearch(e)}
                    icon="search"
                />
                <table id="table">
                    <thead>
                        <tr>
                            <th><b>Mã Loại</b>{' '}<FontAwesomeIcon icon={faArrowCircleUp} className="sort-icon" onClick={(e) => this.handleSortInc(e, 'id')}/><FontAwesomeIcon icon={faArrowCircleDown} className="sort-icon" onClick={(e) => this.handleSortDes(e, 'id')}/></th>
                            <th><b>Tên</b>{' '}<FontAwesomeIcon icon={faArrowCircleUp} className="sort-icon" onClick={(e) => this.handleSortInc(e, 'name')}/><FontAwesomeIcon icon={faArrowCircleDown} className="sort-icon" onClick={(e) => this.handleSortDes(e, 'name')}/></th>
                            <th><b>Mô Tả</b></th>
                            <th>Cập Nhập</th>
                            <th>Xóa</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.categories.map((cate) => (
                                <tr key={cate.id} onClick={() => this.find(cate.id)}>
                                    <td>{cate.id}</td>
                                    <td>{cate.name}</td>
                                    <td>{cate.description}</td>
                                    <td>
                                        <Link to={`/admin/category/update/${cate.id}`}>
                                            <button className="btn btn-success">
                                            <FontAwesomeIcon icon={faEdit} className="mr-2"/>{' '}
                                                
                                            </button>
                                        </Link>
                                    </td>
                                    <td><button className="btn btn-danger" onClick={(e) => this.onToggleFormDel(e, cate.id)}>
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
                        <ModalHeader toggle={this.onToggleForm}>Thêm Loại Mới</ModalHeader>
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
