import React, { Component } from 'react'
import "./../Category/Category.css";
import {del, get, post, put} from "./../../Utils/httpHelper";
import { Link } from 'react-router-dom';
import Add from "./Add"
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus, faTrash, faUnlock, faUserLock, faArrowCircleDown, faArrowCircleUp } from '@fortawesome/free-solid-svg-icons';
import { Breadcrumb, Input, Label } from 'semantic-ui-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class User extends Component {
    constructor (props){
        super(props);

        this.state = {
            users: [],
            roles: [],
            isDisplayForm: false,
            isDisplayFormDel: false,
            pageNumber: 0,
            pageToTal: 0,
            id: "",
            search: "",
            title: "",
            notice: "",
            currentPage: 7
        }

        this.onPage = this.onPage.bind(this);
    }
    

    componentDidMount(){
        get("/users")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    pageToTal: Math.ceil(response.data.length / this.state.currentPage)
                });
            }
        })
        .catch(error => {console.log(error)})

        get(`/users/page?pageNumber=0&pageSize=${this.state.currentPage}&sortBy=id`)
        .then((response) => {
            this.setState({
                users: response.data,
            });
        })
        .catch(error => console.log(error));

        get("/roles")
        .then((response) => {
            this.setState({
                roles: response.data
            });
        })
    }

    find(id){
        get(`/users/${id}`)
        .then((response) => {
            if (response.status === 200)
            {
            }
        })
    }

    async delUser(e, id)
    {
        e.preventDefault();
        if (this.state.title === 'Khóa Tài Khoản')
        {
            await del(`/users/${id}`)
            .then((response) => {
                if (response.status === 200)
                {
                    // this.setState({users: this.state.users.filter(u => u.id !== id)})
                    this.setState({isDisplayFormDel: false})
                }
            })
            // .catch(error => {alert('The user had bill. Can not delete!')})
            .catch(error => {toast.error('Khách hàng đã có hóa đơn tại cửa hàng!')})
        }
        else
        {
            var u = {};
            await get(`/users/${id}`)
            .then((response) => {
                if (response.status === 200)
                {
                    u = response.data
                }
            })
            await put(`/users/${id}`, {name: u.name, gender: u.gender, address: u.address, email: u.email,
                                        phone: u.phone, account: u.account, active_status: 'Active', role_id: u.role_id})
                .then((response) => {
                    if (response.status === 200)
                    {
                        this.setState({isDisplayFormDel: false})
                    }
                })
        }
        if (this.state.search === '')
        {
            get(`/users/page?pageNumber=${this.state.pageNumber}&pageSize=${this.state.currentPage}&sortBy=id`)
            .then((response) => {
                this.setState({
                    users: response.data,
                });
            })
            .catch(error => console.log(error));
        }
        else
        {
            get(`/users/usernamePage?username=${this.state.search}&pageNumber=${this.state.pageNumber}&pageSize=${this.state.currentPage}&sortBy=id`)
            .then((response) => {
                this.setState({
                    users: response.data,
                });
            })
            .catch(error => console.log(error));
        }
    }

    createUser(newUser){
        //console.log(newUser.role);
        post(`/auth/signup`, {name: newUser.fullname.trim(), gender: newUser.gender, address: newUser.address.trim(),
                        email: newUser.email.trim(), phone: newUser.phone.trim(), username: newUser.username,
                        password: newUser.password, role: newUser.role})
        .then((response) => {
            window.location.reload();
            this.setState({
                users: [response.data, ...this.state.users],
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

    onToggleFormDel = (e, id, key) => {
        e.preventDefault()
        if (key === 'lock')
        {
            this.setState({
                isDisplayFormDel: !this.state.isDisplayFormDel,
                id: id,
                title: 'Khóa Tài Khoản',
                notice: 'Bạn có chắc chắn muốn khóa tài khoản người dùng này?'
            });
        }
        else
        {
            this.setState({
                isDisplayFormDel: !this.state.isDisplayFormDel,
                id: id,
                title: 'Kích Hoạt Tài Khoản',
                notice: 'Bạn có chắc chắn muốn kích hoạt tài khoản người dùng này?'
            });
        }
    }

    onCloseFormDel = (e) => {
        e.preventDefault()
        this.setState({
            isDisplayFormDel: false,
        });
    }

    onAdd = (data) => {
        //console.log(data);
        this.createUser(data);
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
            get(`/users/page?pageNumber=${pageNumber}&pageSize=${this.state.currentPage}&sortBy=id`)
            .then((response) => {
                this.setState({
                    users: response.data,
                });
            })
            .catch(error => console.log(error));
        }
        else
        {
            get(`/users/usernamePage?username=${this.state.search}&pageNumber=${pageNumber}&pageSize=${this.state.currentPage}&sortBy=id`)
            .then((response) => {
                this.setState({
                    users: response.data,
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
            get("/users")
            .then((response) => {
                if (response.status === 200)
                {
                    this.setState({
                        pageToTal: Math.ceil(response.data.length / this.state.currentPage)
                    });
                }
            })
            .catch(error => {console.log(error)})

            get(`/users/page?pageNumber=0&pageSize=${this.state.currentPage}&sortBy=id`)
            .then((response) => {
                this.setState({
                    users: response.data,
                });
            })
            .catch(error => console.log(error));
        }
        else
        {
            get(`/users/username?username=${this.state.search}`)
            .then((response) => {
                if (response.status === 200)
                {
                    this.setState({
                        pageToTal: Math.ceil(response.data / this.state.currentPage)
                    });
                }
            })
            .catch(error => {console.log(error)})

            get(`/users/usernamePage?username=${this.state.search}&pageNumber=0&pageSize=${this.state.currentPage}&sortBy=id`)
            .then((response) => {
                this.setState({
                    users: response.data,
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
                users: this.state.users.sort((e1, e2) => (e1.id > e2.id ? 1 : -1))
            })
        }
        else if (key === 'name')
        {
            this.setState({
                users: this.state.users.sort((e1, e2) => (e1.name > e2.name ? 1 : -1))
            })
        }
        else if (key === 'gender')
        {
            this.setState({
                users: this.state.users.sort((e1, e2) => (e1.gender > e2.gender ? 1 : -1))
            })
        }
        else if (key === 'address')
        {
            this.setState({
                users: this.state.users.sort((e1, e2) => (e1.address > e2.address ? 1 : -1))
            })
        }
        else if (key === 'email')
        {
            this.setState({
                users: this.state.users.sort((e1, e2) => (e1.email > e2.email ? 1 : -1))
            })
        }
        else if (key === 'phone')
        {
            this.setState({
                users: this.state.users.sort((e1, e2) => (e1.phone > e2.phone ? 1 : -1))
            })
        }
        else if (key === 'username')
        {
            this.setState({
                users: this.state.users.sort((e1, e2) => (e1.account > e2.account ? 1 : -1))
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
                users: this.state.users.sort((e1, e2) => (e2.id > e1.id ? 1 : -1))
            })
        }
        else if (key === 'name')
        {
            this.setState({
                users: this.state.users.sort((e1, e2) => (e2.name > e1.name ? 1 : -1))
            })
        }
        else if (key === 'gender')
        {
            this.setState({
                users: this.state.users.sort((e1, e2) => (e2.gender > e1.gender ? 1 : -1))
            })
        }
        else if (key === 'address')
        {
            this.setState({
                users: this.state.users.sort((e1, e2) => (e2.address > e1.address ? 1 : -1))
            })
        }
        else if (key === 'email')
        {
            this.setState({
                users: this.state.users.sort((e1, e2) => (e2.email > e1.email ? 1 : -1))
            })
        }
        else if (key === 'phone')
        {
            this.setState({
                users: this.state.users.sort((e1, e2) => (e2.phone > e1.phone ? 1 : -1))
            })
        }
        else if (key === 'username')
        {
            this.setState({
                users: this.state.users.sort((e1, e2) => (e2.account > e1.account ? 1 : -1))
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
            { key: 'Người Dùng', content: 'Người Dùng', active: true }
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
                        {/* Xóa Người Dùng */}
                        {this.state.title}
                    </ModalHeader>
                    <ModalBody>
                        <p>
                        {/* Bạn có chắc chắn muốn xóa? */}
                        {this.state.notice}
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={(e) => this.delUser(e, this.state.id)} className="btn-danger">Đồng Ý</Button>
                        <Button onClick={(e) => this.onCloseFormDel(e)}>Hủy</Button>
                    </ModalFooter>
                </Modal>
                <Breadcrumb icon='right angle' sections={sections} size='large'/>
                <br/>
                <div className="m-3">
                <button type="button" className="btn btn-primary" onClick={this.onToggleForm} disabled={localStorage.getItem('role') === 'STAFF'}>
                    <FontAwesomeIcon icon={faPlus} className="mr-2"/>{' '}
                    Thêm Tài Khoản
                </button>
                <Input
                    style={{marginLeft: '100rem'}}
                    placeholder="Tên tài khoản..."
                    value={this.state.search}
                    onChange={(e) => this.handleSearch(e)}
                    icon="search"
                />
                </div>
                <table id="table">
                    <thead>
                        <tr>
                            <th><b>ID</b>{' '}<FontAwesomeIcon icon={faArrowCircleUp} className="sort-icon" onClick={(e) => this.handleSortInc(e, 'id')}/><FontAwesomeIcon icon={faArrowCircleDown} className="sort-icon" onClick={(e) => this.handleSortDes(e, 'id')}/></th>
                            <th><b>Họ Tên</b>{' '}<FontAwesomeIcon icon={faArrowCircleUp} className="sort-icon" onClick={(e) => this.handleSortInc(e, 'name')}/><FontAwesomeIcon icon={faArrowCircleDown} className="sort-icon" onClick={(e) => this.handleSortDes(e, 'name')}/></th>
                            <th><b>Giới Tính</b>{' '}<FontAwesomeIcon icon={faArrowCircleUp} className="sort-icon" onClick={(e) => this.handleSortInc(e, 'gender')}/><FontAwesomeIcon icon={faArrowCircleDown} className="sort-icon" onClick={(e) => this.handleSortDes(e, 'gender')}/></th>
                            <th><b>Địa Chỉ</b>{' '}<FontAwesomeIcon icon={faArrowCircleUp} className="sort-icon" onClick={(e) => this.handleSortInc(e, 'address')}/><FontAwesomeIcon icon={faArrowCircleDown} className="sort-icon" onClick={(e) => this.handleSortDes(e, 'address')}/></th>
                            <th><b>Email</b>{' '}<FontAwesomeIcon icon={faArrowCircleUp} className="sort-icon" onClick={(e) => this.handleSortInc(e, 'email')}/><FontAwesomeIcon icon={faArrowCircleDown} className="sort-icon" onClick={(e) => this.handleSortDes(e, 'email')}/></th>
                            <th><b>Số Điện Thoại</b>{' '}<FontAwesomeIcon icon={faArrowCircleUp} className="sort-icon" onClick={(e) => this.handleSortInc(e, 'phone')}/><FontAwesomeIcon icon={faArrowCircleDown} className="sort-icon" onClick={(e) => this.handleSortDes(e, 'phone')}/></th>
                            <th><b>Tài Khoản</b>{' '}<FontAwesomeIcon icon={faArrowCircleUp} className="sort-icon" onClick={(e) => this.handleSortInc(e, 'username')}/><FontAwesomeIcon icon={faArrowCircleDown} className="sort-icon" onClick={(e) => this.handleSortDes(e, 'username')}/></th>
                            <th><b>Vai Trò</b></th>
                            <th><b>Trạng Thái</b></th>
                            <th>Cập Nhập</th>
                            {/* <th>Xóa</th> */}
                            <th>Kích Hoạt/Khóa</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.users.map((u) => (
                                <tr key={u.id}>
                                    <td>{u.id}</td>
                                    <td>{u.name}</td>
                                    {/* <td>{u.gender}</td> */}
                                    {u.gender === 'Male' && <td>Nam</td>}
                                    {u.gender === 'Female' && <td>Nữ</td>}
                                    <td>{u.address}</td>
                                    <td>{u.email}</td>
                                    <td>{u.phone}</td>
                                    <td>{u.account}</td>
                                    <td>{u.role.name}</td>
                                    {u.active_status === 'Active' && <td><Label color="green">Hoạt Động</Label></td>}
                                    {u.active_status === 'Inactive' && <td><Label color="red">Không Hoạt Động</Label></td>}
                                    <td>
                                        <Link to={`/admin/user/update/${u.id}`} onClick={u.id == localStorage.getItem('user_id') && localStorage.getItem('role') === 'STAFF' || localStorage.getItem('role') === 'ADMIN' ? '' : (e) => e.preventDefault()}
                                            >
                                            <button className="btn btn-success" disabled={u.id != localStorage.getItem('user_id') && localStorage.getItem('role') === 'STAFF'}>
                                                <FontAwesomeIcon icon={faEdit} className="mr-2"/>{' '}
                                                
                                            </button>
                                        </Link>
                                    </td>
                                    {u.active_status === 'Active' &&
                                    <td>
                                        <button className="btn btn-danger" onClick={(e) => this.onToggleFormDel(e, u.id, 'lock')} disabled={localStorage.getItem('role') === 'STAFF'}>
                                        {/* || u.active_status === 'Inactive' */}
                                        {/* <FontAwesomeIcon icon={faTrash} className="mr-2"/>{' '} */}
                                        <FontAwesomeIcon icon={faUserLock} className="mr-2"/>{' '}
                                        </button>
                                    </td>}
                                    {u.active_status === 'Inactive' &&
                                    <td>
                                        <button className="btn btn-primary" onClick={(e) => this.onToggleFormDel(e, u.id, 'unlock')} disabled={localStorage.getItem('role') === 'STAFF'}>
                                        {/* || u.active_status === 'Inactive' */}
                                        {/* <FontAwesomeIcon icon={faTrash} className="mr-2"/>{' '} */}
                                        <FontAwesomeIcon icon={faUnlock} className="mr-2"/>{' '}
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
                        <PaginationLink previous href="#" onClick={(event) => this.onPage(event, this.state.pageNumber - 1)}/>
                    </PaginationItem>
                    {[...Array(this.state.pageToTal)].map((page, i) => 
                        <PaginationItem active={i === this.state.pageNumber} key={i}>
                            <PaginationLink onClick={(event) => this.onPage(event, i)}>
                            {i + 1}
                            </PaginationLink>
                        </PaginationItem>
                    )}
                    <PaginationItem>
                        <PaginationLink next href="#" onClick={(event) => this.onPage(event, this.state.pageNumber + 1)}/>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink last onClick={(event) => this.onPage(event, this.state.pageToTal-1)} />
                    </PaginationItem>
                </Pagination>

                <div className="container">
                    <Modal isOpen={this.state.isDisplayForm} toggle={this.onToggleForm}>
                        <ModalHeader toggle={this.onToggleForm}>Thêm Tài Khoản</ModalHeader>
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
