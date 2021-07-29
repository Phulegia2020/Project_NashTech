import React, {Component} from 'react';
import "./Category.css";
import {del, get, post, put} from "./../../Utils/httpHelper";
import { Link } from 'react-router-dom';
import Add from "./Add"
import Update from './UpdateCategory';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Pagination, PaginationItem, PaginationLink, Toast } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

export default class Category extends Component {
    state = {
        categories: [],
        isDisplayForm: false,
        pageNumber: 0,
        pageToTal: 0,
        msgDel: false
    }

    componentDidMount(){
        get("/categories")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    pageToTal: Math.ceil(response.data.length / 4)
                })
            }
        })
        .catch(error => {console.log(error)})

        get(`/categories/page?pageNumber=0&pageSize=4&sortBy=id`)
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
                //console.log(response.data);
            }
        })
    }

    delCategory(id)
    {
        del(`/categories/${id}`)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({categories: this.state.categories.filter(cate => cate.id !== id)})
                alert(response.data.message);
            }
            else{
                this.setState({
                    msgDel: true
                })
            }
            //console.log(response.data);
            
        })
        .catch(error => {alert('This category had products. Can not delete!')})
    }

    createCategory(newCategory){
        post(`/categories`, {name: newCategory.name.trim(), description: newCategory.description.trim()})
        .then((response) => {
            //console.log(response.data);
            window.location.reload();
            this.setState({
                categories: [...this.state.categories, response.data],
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
        
        get(`/categories/page?pageNumber=${pageNumber}&pageSize=4&sortBy=id`)
        .then((response) => {
            this.setState({
                categories: response.data,
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
            <div>
                <button type="button" className="btn btn-primary" onClick={this.onToggleForm}>
                    <FontAwesomeIcon icon={faPlus} className="mr-2"/>{' '}
                    Creat New Category
                </button>
                <table id="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.categories.map((cate) => (
                                <tr key={cate.id} onClick={() => this.find(cate.id)}>
                                    <td>{cate.id}</td>
                                    <td>{cate.name}</td>
                                    <td>{cate.description}</td>
                                    <td><button className="btn btn-danger" onClick={() => this.delCategory(cate.id)}>
                                        <FontAwesomeIcon icon={faTrash} className="mr-2"/>{' '}
                                        Del
                                        </button>
                                    </td>
                                    <td>
                                        <Link to={`/admin/category/update/${cate.id}`}>
                                            <button className="btn btn-success">
                                            <FontAwesomeIcon icon={faEdit} className="mr-2"/>{' '}
                                                Update
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
                        <ModalHeader toggle={this.onToggleForm}>Create New Category</ModalHeader>
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
