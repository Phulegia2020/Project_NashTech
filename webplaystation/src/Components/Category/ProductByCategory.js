import React, { Component } from 'react'
import { get, del } from '../../Utils/httpHelper'
import { withRouter } from "react-router";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash,faArrowCircleDown,faArrowCircleUp } from '@fortawesome/free-solid-svg-icons';
import { formatCurrency, formatQuantity } from '../../Utils/Utils';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { Breadcrumb } from 'semantic-ui-react'

class ProductByCategory extends Component {
    state = {
        id: this.props.match.params.id,
        products: [],
        iddel: "",
        isDisplayFormDel: false,
        pageNumber: 0,
        pageToTal: 0,
        category: '',
        currentPage: 3
    }

    componentDidMount(){
        get(`/products/search?categoryId=${this.state.id}`)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    pageToTal: Math.ceil(response.data.length / this.state.currentPage)
                });
            }
        })

        get(`/products/searchPage?categoryId=${this.state.id}&pageNumber=0&pageSize=${this.state.currentPage}&sortBy=id`)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({products: response.data});
            }
        })
        .catch(error => {console.log(error)})

        get(`/categories/${this.state.id}`)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    category: response.data.name
                })
            }
        })
    }

    delProduct = (e, id) =>
    {
        e.preventDefault();
        del(`/products/${id}`)
        .then((response) => {
            this.setState({products: this.state.products.filter(p => p.id !== id), isDisplayFormDel: false})
        })
        .catch(error => {console.log(error)})
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

        get(`/products/searchPage?categoryId=${this.state.id}&pageNumber=${pageNumber}&pageSize=${this.state.currentPage}&sortBy=id`)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({products: response.data});
            }
        })
        .catch(error => {console.log(error)})
    }

    handleSortInc = (e, key) => {
        e.preventDefault();
        if (key === 'id')
        {
            this.setState({
                products: this.state.products.sort((e1, e2) => (e1.id > e2.id ? 1 : -1))
            })
        }
        else if (key === 'name')
        {
            this.setState({
                products: this.state.products.sort((e1, e2) => (e1.name > e2.name ? 1 : -1))
            })
        }
        else if (key === 'quantity')
        {
            this.setState({
                products: this.state.products.sort((e1, e2) => (e1.quantity > e2.quantity ? 1 : -1))
            })
        }
        else if (key === 'price')
        {
            this.setState({
                products: this.state.products.sort((e1, e2) => (e1.price > e2.price ? 1 : -1))
            })
        }
    }

    handleSortDes = (e, key) => {
        e.preventDefault();
        if (key === 'id')
        {
            this.setState({
                products: this.state.products.sort((e1, e2) => (e2.id > e1.id ? 1 : -1))
            })
        }
        else if (key === 'name')
        {
            this.setState({
                products: this.state.products.sort((e1, e2) => (e2.name > e1.name ? 1 : -1))
            })
        }
        else if (key === 'quantity')
        {
            this.setState({
                products: this.state.products.sort((e1, e2) => (e2.quantity > e1.quantity ? 1 : -1))
            })
        }
        else if (key === 'price')
        {
            this.setState({
                products: this.state.products.sort((e1, e2) => (e2.price > e1.price ? 1 : -1))
            })
        }
    }

    componentWillUnmount() {
        this.setState({
            products: []
        })
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }

    render() {
        const sections = [
            { key: 'Quản Lý', content: 'Quản Lý', link: false },
            { key: 'Loại Sản Phẩm', content: 'Loại Sản Phẩm'},
            { key: `${this.state.category}`, content: `${this.state.category}`, active: true }
          ]
        return (
            <div  className="list-details">
                <Modal
                    isOpen={this.state.isDisplayFormDel}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    toggle={this.onToggleFormDel}
                    >
                    <ModalHeader>
                        Xóa Máy
                    </ModalHeader>
                    <ModalBody>
                        <p>
                        Bạn có chắc chắn muốn xóa?
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={(e) => this.delProduct(e, this.state.iddel)} className="btn-danger">Xóa</Button>
                        <Button onClick={(e) => this.onCloseFormDel(e)}>Hủy</Button>
                    </ModalFooter>
                </Modal>
                <Breadcrumb icon='right angle' sections={sections} size='large'/>
                <h3>Danh Sách Máy Loại {this.state.category}</h3>
                <table id="table">
                    <thead>
                        <tr>
                            <th><b>Mã ID</b>{' '}<FontAwesomeIcon icon={faArrowCircleUp} className="sort-icon" onClick={(e) => this.handleSortInc(e, 'id')}/><FontAwesomeIcon icon={faArrowCircleDown} className="sort-icon" onClick={(e) => this.handleSortDes(e, 'id')}/></th>
                            <th><b>Hình Ảnh</b></th>
                            <th><b>Tên</b>{' '}<FontAwesomeIcon icon={faArrowCircleUp} className="sort-icon" onClick={(e) => this.handleSortInc(e, 'name')}/><FontAwesomeIcon icon={faArrowCircleDown} className="sort-icon" onClick={(e) => this.handleSortDes(e, 'name')}/></th>
                            <th><b>Thông Tin</b></th>
                            <th><b>Số Lượng</b>{' '}<FontAwesomeIcon icon={faArrowCircleUp} className="sort-icon" onClick={(e) => this.handleSortInc(e, 'quantity')}/><FontAwesomeIcon icon={faArrowCircleDown} className="sort-icon" onClick={(e) => this.handleSortDes(e, 'quantity')}/></th>
                            <th><b>Đơn Giá</b>{' '}<FontAwesomeIcon icon={faArrowCircleUp} className="sort-icon" onClick={(e) => this.handleSortInc(e, 'price')}/><FontAwesomeIcon icon={faArrowCircleDown} className="sort-icon" onClick={(e) => this.handleSortDes(e, 'price')}/></th>
                            <th>Cập Nhật</th>
                            <th>Xóa</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.products.map((p) => (
                                <tr key={p.id}>
                                    <td>{p.id}</td>
                                    <td>
                                        <img src={p.url_image || "http://via.placeholder.com/300"} alt="" height="100px"/>
                                    </td>
                                    <td>{p.name}</td>
                                    <td className="descriptionTable">{p.description}</td>
                                    <td>{formatQuantity(p.quantity)}</td>
                                    <td>{formatCurrency(p.price)}</td>
                                    <td>
                                        <Link to={`/admin/product/update/${p.id}`}>
                                            <button className="btn btn-success">
                                                <FontAwesomeIcon icon={faEdit} className="mr-2"/>{' '}
                                                
                                            </button>
                                        </Link>
                                    </td>
                                    <td><button className="btn btn-danger" onClick={(e) => this.onToggleFormDel(e, p.id)} disabled={p.status === 'Stop'}>
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
            </div>
        )
    }
}

export default withRouter(ProductByCategory);