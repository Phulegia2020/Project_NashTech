import React, { Component } from 'react';
import "./../Category/Category.css";
import {del, get, post} from "./../../Utils/httpHelper";
import { Link } from 'react-router-dom';
import { withRouter } from "react-router";
import Add from "./Add"
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus, faTrash, faArrowCircleUp, faArrowCircleDown } from '@fortawesome/free-solid-svg-icons';
import { Input, Breadcrumb } from 'semantic-ui-react';

class Comment extends React.Component {
    state = {
        comments: [],
        isDisplayForm: false,
        isDisplayFormDel: false,
        pageNumber: 0,
        pageToTal: 0,
        id: "",
        search: "",
        currentPage: 6
    }

    componentDidMount(){
        get("/comments")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    pageToTal: Math.ceil(response.data.length / this.state.currentPage)
                })
            }
        })
        .catch(error => {console.log(error)})

        get(`/comments/page?pageNumber=0&pageSize=${this.state.currentPage}&sortBy=id`)
        .then((response) => {
            this.setState({
                comments: response.data,
            });
        })
        .catch(error => console.log(error));
    }

    find(id){
        get(`/comments/${id}`)
        .then((response) => {
            if (response.status === 200)
            {
            }
        })
    }

    delComment = (e, id) =>
    {
        e.preventDefault();
        del(`/comments/${id}`)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({comments: this.state.comments.filter(p => p.id !== id)})
                this.setState({isDisplayFormDel: false})
            }
        })
        .catch(error => {})
    }

    createComment(newComment){
        post(`/comments`, {content: newComment.content.trim(), user_id: newComment.user_id, product_id: newComment.product_id})
        .then((response) => {
            if (response.status === 200)
            {
                //window.location.reload();
                this.setState({
                    comments: [response.data, ...this.state.comments],
                });
                //console.log(response.data);
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
        this.createComment(data);
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
            get(`/comments/page?pageNumber=${pageNumber}&pageSize=${this.state.currentPage}&sortBy=id`)
            .then((response) => {
                this.setState({
                    comments: response.data,
                });
            })
            .catch(error => console.log(error));
        }
        else
        {
            get(`/comments/namePage?name=${this.state.search}&pageNumber=${pageNumber}&pageSize=${this.state.currentPage}&sortBy=id`)
            .then((response) => {
                if (response.status === 200)
                {
                    this.setState({comments: response.data});
                }
            })
            .catch(error => {console.log(error)})
        }
    }

    async handleSearch(e){
        e.preventDefault()
        await this.setState({
            search: e.target.value
        })
        if (this.state.search === '')
        {
            get("/comments")
            .then((response) => {
                if (response.status === 200)
                {
                    this.setState({
                        pageToTal: Math.ceil(response.data.length / this.state.currentPage)
                    })
                }
            })
            .catch(error => {console.log(error)})

            get(`/comments/page?pageNumber=0&pageSize=${this.state.currentPage}&sortBy=id`)
            .then((response) => {
                this.setState({
                    comments: response.data,
                });
            })
            .catch(error => console.log(error));
        }
        else
        {
            get(`/comments/name?name=${this.state.search}`)
            .then((response) => {
                if (response.status === 200)
                {
                    this.setState({
                        pageToTal: Math.ceil(response.data / this.state.currentPage)
                    });
                }
            })
            .catch(error => {console.log(error)})

            get(`/comments/namePage?name=${this.state.search}&pageNumber=0&pageSize=${this.state.currentPage}&sortBy=id`)
            .then((response) => {
                this.setState({
                    comments: response.data,
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
                comments: this.state.comments.sort((e1, e2) => (e1.id > e2.id ? 1 : -1))
            })
        }
        else if (key === 'product')
        {
            this.setState({
                comments: this.state.comments.sort((e1, e2) => (e1.productName > e2.productName ? 1 : -1))
            })
        }
        else if (key === 'time')
        {
            this.setState({
                comments: this.state.comments.sort((e1, e2) => (e1.date_comment > e2.date_comment ? 1 : -1))
            })
        }
        else if (key === 'account')
        {
            this.setState({
                comments: this.state.comments.sort((e1, e2) => (e1.username > e2.username ? 1 : -1))
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
                comments: this.state.comments.sort((e1, e2) => (e2.id > e1.id ? 1 : -1))
            })
        }
        else if (key === 'product')
        {
            this.setState({
                comments: this.state.comments.sort((e1, e2) => (e2.productName > e1.productName ? 1 : -1))
            })
        }
        else if (key === 'time')
        {
            this.setState({
                comments: this.state.comments.sort((e1, e2) => (e2.date_comment > e1.date_comment ? 1 : -1))
            })
        }
        else if (key === 'account')
        {
            this.setState({
                comments: this.state.comments.sort((e1, e2) => (e2.username > e1.username ? 1 : -1))
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
            { key: 'Bình Luận', content: 'Bình Luận', active: true }
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
                        Thông Báo
                    </ModalHeader>
                    <ModalBody>
                        <p>
                        Bạn có chắc muốn xóa bình luận này?
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={(e) => this.delComment(e, this.state.id)} className="btn-danger">Xóa</Button>
                        <Button onClick={(e) => this.onCloseFormDel(e)}>Đóng</Button>
                    </ModalFooter>
                </Modal>
                <Breadcrumb icon='right angle' sections={sections} size='large'/>
                <br/>
                <button type="button" className="btn btn-primary" onClick={this.onToggleForm} style={{marginTop: '30px'}}>
                    <FontAwesomeIcon icon={faPlus} className="mr-2"/>{' '}
                    Tạo Bình Luận
                </button>
                <Input
                    style={{marginLeft: '100rem'}}
                    placeholder="Tên sản phẩm..."
                    value={this.state.search}
                    onChange={(e) => this.handleSearch(e)}
                    icon="search"
                />
                <table id="table">
                    <thead>
                        <tr>
                            <th><b>Mã</b>{' '}<FontAwesomeIcon icon={faArrowCircleUp} className="sort-icon" onClick={(e) => this.handleSortInc(e, 'id')}/><FontAwesomeIcon icon={faArrowCircleDown} className="sort-icon" onClick={(e) => this.handleSortDes(e, 'id')}/></th>
                            <th><b>Sản Phẩm</b></th>
                            <th><b>Tên Sản Phẩm</b>{' '}<FontAwesomeIcon icon={faArrowCircleUp} className="sort-icon" onClick={(e) => this.handleSortInc(e, 'product')}/><FontAwesomeIcon icon={faArrowCircleDown} className="sort-icon" onClick={(e) => this.handleSortDes(e, 'product')}/></th>
                            <th><b>Thời Gian</b>{' '}<FontAwesomeIcon icon={faArrowCircleUp} className="sort-icon" onClick={(e) => this.handleSortInc(e, 'time')}/><FontAwesomeIcon icon={faArrowCircleDown} className="sort-icon" onClick={(e) => this.handleSortDes(e, 'time')}/></th>
                            <th><b>Bình Luận</b></th>
                            <th><b>Tài Khoản</b>{' '}<FontAwesomeIcon icon={faArrowCircleUp} className="sort-icon" onClick={(e) => this.handleSortInc(e, 'account')}/><FontAwesomeIcon icon={faArrowCircleDown} className="sort-icon" onClick={(e) => this.handleSortDes(e, 'account')}/></th>
                            <th>Cập Nhật</th>
                            <th>Xóa</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.comments.map((c) => (
                                <tr key={c.id}>
                                    <td>{c.id}</td>
                                    <td>
                                        {/* <img src={`data:image/jpeg;base64,${c.productImg}`} alt="" height="50px"></img> */}
                                        <img src={c.productImg} alt="" height="50px"></img>
                                    </td>
                                    <td>{c.productName}</td>
                                    <td>{c.date_comment}</td>
                                    <td className="descriptionTable">{c.content}</td>
                                    <td>{c.username}</td>
                                    <td>
                                        <Link to={`/admin/comment/update/${c.id}`}>
                                            <button className="btn btn-success">
                                            <FontAwesomeIcon icon={faEdit} className="mr-2"/>{' '}
                                                
                                            </button>
                                        </Link>
                                    </td>
                                    <td><button onClick={(e) => this.onToggleFormDel(e, c.id)} className="btn btn-danger">
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
                        <ModalHeader toggle={this.onToggleForm}>Tạo Bình Luận Mới</ModalHeader>
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
export default withRouter(Comment);