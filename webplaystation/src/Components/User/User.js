import React, { Component } from 'react'
import "./../Category/Category.css";
import {del, get, post} from "./../../Utils/httpHelper";
import { Link } from 'react-router-dom';
import Add from "./Add"
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Breadcrumb, Input } from 'semantic-ui-react';

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
            search: ""
        }

        this.onPage = this.onPage.bind(this);
    }
    

    componentDidMount(){
        get("/users/active")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    pageToTal: Math.ceil(response.data / 5)
                });
            }
        })
        .catch(error => {console.log(error)})

        get(`/users/page?pageNumber=0&pageSize=5&sortBy=id`)
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

    delUser = (e, id) =>
    {
        e.preventDefault();
        del(`/users/${id}`)
        .then((response) => {
            this.setState({users: this.state.users.filter(u => u.id !== id)})
            this.setState({isDisplayFormDel: false})
        })
        .catch(error => {alert('The user had bill. Can not delete!')})
    }

    createUser(newUser){
        post(`/auth/signup`, {name: newUser.fullname.trim(), gender: newUser.gender, address: newUser.address.trim(),
                        email: newUser.email.trim(), phone: newUser.phone.trim(), username: newUser.username,
                        password: newUser.password, role: newUser.role})
        .then((response) => {
            //window.location.reload();
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
            get(`/users/page?pageNumber=${pageNumber}&pageSize=5&sortBy=id`)
            .then((response) => {
                this.setState({
                    users: response.data,
                });
            })
            .catch(error => console.log(error));
        }
        else
        {
            get(`/users/usernamePage?username=${this.state.search}&pageNumber=${pageNumber}&pageSize=5&sortBy=id`)
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
            get("/users/active")
            .then((response) => {
                if (response.status === 200)
                {
                    this.setState({
                        pageToTal: Math.ceil(response.data / 5)
                    });
                }
            })
            .catch(error => {console.log(error)})

            get(`/users/page?pageNumber=0&pageSize=5&sortBy=id`)
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
                        pageToTal: Math.ceil(response.data / 5)
                    });
                }
            })
            .catch(error => {console.log(error)})

            get(`/users/usernamePage?username=${this.state.search}&pageNumber=0&pageSize=5&sortBy=id`)
            .then((response) => {
                this.setState({
                    users: response.data,
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
                        Delete
                    </ModalHeader>
                    <ModalBody>
                        <p>
                        Do you want to disable this account?
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={(e) => this.delUser(e, this.state.id)} className="btn-danger">Delete</Button>
                        <Button onClick={(e) => this.onCloseFormDel(e)}>Close</Button>
                    </ModalFooter>
                </Modal>
                <Breadcrumb icon='right angle' sections={sections} size='large'/>
                <br/>
                <div className="m-3">
                <button type="button" className="btn btn-primary" onClick={this.onToggleForm} disabled={localStorage.getItem('role') === 'STAFF'}>
                    <FontAwesomeIcon icon={faPlus} className="mr-2"/>{' '}
                    Creat New User
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
                            <th><b>ID</b></th>
                            <th><b>Name</b></th>
                            <th><b>Gender</b></th>
                            <th><b>Address</b></th>
                            <th><b>Email</b></th>
                            <th><b>Phone</b></th>
                            <th><b>Username</b></th>
                            <th><b>Role</b></th>
                            <th>Update</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.users.map((u) => (
                                <tr key={u.id}>
                                    <td>{u.id}</td>
                                    <td>{u.name}</td>
                                    <td>{u.gender}</td>
                                    <td>{u.address}</td>
                                    <td>{u.email}</td>
                                    <td>{u.phone}</td>
                                    <td>{u.account}</td>
                                    <td>{u.role.name}</td>
                                    <td>
                                        <Link to={`/admin/user/update/${u.id}`} onClick={u.id == localStorage.getItem('user_id') && localStorage.getItem('role') === 'STAFF' || localStorage.getItem('role') === 'ADMIN' ? '' : (e) => e.preventDefault()}
                                            >
                                            <button className="btn btn-success" disabled={u.id != localStorage.getItem('user_id') && localStorage.getItem('role') === 'STAFF'}>
                                                <FontAwesomeIcon icon={faEdit} className="mr-2"/>{' '}
                                                
                                            </button>
                                        </Link>
                                    </td>
                                    <td><button className="btn btn-danger" onClick={(e) => this.onToggleFormDel(e, u.id)} disabled={localStorage.getItem('role') === 'STAFF' || u.active_status === 'Inactive'}>
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
                        <ModalHeader toggle={this.onToggleForm}>Create New User</ModalHeader>
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
