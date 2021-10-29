import React, { Component } from 'react'
import "./../Category/Category.css";
import {del, get, post} from "./../../Utils/httpHelper";
import {formatQuantity, formatCurrency} from "./../../Utils/Utils";
import { Link } from 'react-router-dom';
import { withRouter } from "react-router";
import Add from "./Add"
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus, faTrash, faArrowCircleUp, faArrowCircleDown } from '@fortawesome/free-solid-svg-icons';
import { Input, Breadcrumb } from 'semantic-ui-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { storage } from "../../Utils/Firebase";

class Product extends Component {
    state = {
        products: [],
        isDisplayForm: false,
        isDisplayFormDel: false,
        pageNumber: 0,
        pageToTal: 0,
        id: "",
        search: ""
    }

    componentDidMount(){
        get("/products/onSale")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    pageToTal: Math.ceil(response.data.length / 3)
                })
            }
        })
        .catch(error => {console.log(error)})

        get(`/products/pageOnSale?pageNumber=0&pageSize=3&sortBy=id`)
        .then((response) => {
            this.setState({
                products: response.data,
            });
        })
        .catch(error => console.log(error));
    }

    find(id){
        get(`/products/${id}`)
        .then((response) => {
            if (response.status === 200)
            {
            }
        })
    }

    delProduct = (e, id) =>
    {
        e.preventDefault();
        del(`/products/${id}`)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({products: this.state.products.filter(p => p.id !== id)})
                this.setState({isDisplayFormDel: false})
            }
        })
        // .catch(error => {alert('The product was ordered. Can not delete!')})
        .catch(error => {toast.error('Máy này đã bán!')})
    }

    createProduct(newProduct){
        console.log(newProduct.image_sub);
        // console.log(newProduct.url);
        // post(`/products`, {name: newProduct.name.trim(), description: newProduct.description.trim(), quantity: newProduct.quantity,
        //                 price: newProduct.price, totalrating: 0,imageurl: newProduct.imageurl, category_id: newProduct.category_id,
        //                 supplier_id: newProduct.supplier_id})
        post(`/products`, {name: newProduct.name.trim(), description: newProduct.description.trim(), quantity: newProduct.quantity,
            price: newProduct.price, totalrating: 0, url_image: newProduct.url, category_id: newProduct.category_id,
            supplier_id: newProduct.supplier_id})
        .then((response) => {
            if (response.status === 200)
            {
                //window.location.reload();
                if (newProduct.image_sub.length > 0)
                {
                    for (let i = 0; i < newProduct.image_sub.length; i++)
                    {
                        const uploadTask = storage.ref(`images/${newProduct.image_sub[i].name}`).put(newProduct.image_sub[i]);
                        uploadTask.on(
                            "state_changed",
                            snapshot => {
                            // const progress = Math.round(
                            //   (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                            // );
                            // setProgress(progress);
                            },
                            error => {
                            console.log(error);
                            },
                            () => {
                            storage
                                .ref("images")
                                .child(newProduct.image_sub[i].name)
                                .getDownloadURL()
                                .then(url => {
                                    // setUrl(url);
                                    post(`/productImages`, {imagePath: url, product_id: response.data.id})
                                    .then((res) => {
                                        if (res.status === 200)
                                        {
                                            console.log(res.data);
                                        }
                                    })
                                    .catch((error) => console.log(error));
                                });
                            }
                        );
                    }
                }
                this.setState({
                    products: [response.data, ...this.state.products],
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
        this.createProduct(data);
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
            get(`/products/pageOnSale?pageNumber=${pageNumber}&pageSize=3&sortBy=id`)
            .then((response) => {
                this.setState({
                    products: response.data,
                });
            })
            .catch(error => console.log(error));
        }
        else
        {
            get(`/products/namePage?name=${this.state.search}&pageNumber=${pageNumber}&pageSize=3&sortBy=id`)
            .then((response) => {
                if (response.status === 200)
                {
                    this.setState({products: response.data});
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
            get("/products/onSale")
            .then((response) => {
                if (response.status === 200)
                {
                    this.setState({
                        pageToTal: Math.ceil(response.data.length / 3)
                    })
                }
            })
            .catch(error => {console.log(error)})

            get(`/products/pageOnSale?pageNumber=0&pageSize=3&sortBy=id`)
            .then((response) => {
                this.setState({
                    products: response.data,
                });
            })
            .catch(error => console.log(error));
        }
        else
        {
            get(`/products/name?name=${this.state.search}`)
            .then((response) => {
                if (response.status === 200)
                {
                    this.setState({
                        pageToTal: Math.ceil(response.data.length / 3)
                    })
                }
            })
            .catch(error => {console.log(error)})
            
            get(`/products/namePage?name=${this.state.search}&pageNumber=0&pageSize=3&sortBy=id`)
            .then((response) => {
                if (response.status === 200)
                {
                    this.setState({products: response.data});
                }
            })
            .catch(error => {console.log(error)})
        }
    }

    handleSortInc = (e, key) => {
        e.preventDefault();
        //this.state.categories.sort((e1, e2) => (e1.id > e2.id ? 1 : -1));
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
        // console.log('sort');
    }

    handleSortDes = (e, key) => {
        e.preventDefault();
        //this.state.categories.sort((e1, e2) => (e1.id > e2.id ? 1 : -1));
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
            { key: 'Sản Phẩm', content: 'Sản Phẩm', active: true }
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
                        Xóa Máy
                    </ModalHeader>
                    <ModalBody>
                        <p>
                        Bạn có chắc chắn muốn xóa?
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={(e) => this.delProduct(e, this.state.id)} className="btn-danger">Xóa</Button>
                        <Button onClick={(e) => this.onCloseFormDel(e)}>Hủy</Button>
                    </ModalFooter>
                </Modal>
                <Breadcrumb icon='right angle' sections={sections} size='large'/>
                <br/>
                <button type="button" className="btn btn-primary" onClick={this.onToggleForm} style={{marginTop: '30px'}}>
                    <FontAwesomeIcon icon={faPlus} className="mr-2"/>{' '}
                    Thêm Máy Mới
                </button>
                <Input
                    style={{marginLeft: '100rem'}}
                    placeholder="Tên Máy..."
                    value={this.state.search}
                    onChange={(e) => this.handleSearch(e)}
                    icon="search"
                />
                <table id="table">
                    <thead>
                        <tr>
                            <th><b>Mã Máy</b>{' '}<FontAwesomeIcon icon={faArrowCircleUp} className="sort-icon" onClick={(e) => this.handleSortInc(e, 'id')}/><FontAwesomeIcon icon={faArrowCircleDown} className="sort-icon" onClick={(e) => this.handleSortDes(e, 'id')}/></th>
                            <th><b>Hình Ảnh</b></th>
                            <th><b>Tên</b>{' '}<FontAwesomeIcon icon={faArrowCircleUp} className="sort-icon" onClick={(e) => this.handleSortInc(e, 'name')}/><FontAwesomeIcon icon={faArrowCircleDown} className="sort-icon" onClick={(e) => this.handleSortDes(e, 'name')}/></th>
                            <th><b>Thông Tin</b></th>
                            <th><b>Số Lượng</b>{' '}<FontAwesomeIcon icon={faArrowCircleUp} className="sort-icon" onClick={(e) => this.handleSortInc(e, 'quantity')}/><FontAwesomeIcon icon={faArrowCircleDown} className="sort-icon" onClick={(e) => this.handleSortDes(e, 'quantity')}/></th>
                            <th><b>Đơn Giá</b>{' '}<FontAwesomeIcon icon={faArrowCircleUp} className="sort-icon" onClick={(e) => this.handleSortInc(e, 'price')}/><FontAwesomeIcon icon={faArrowCircleDown} className="sort-icon" onClick={(e) => this.handleSortDes(e, 'price')}/></th>
                            <th>Cập Nhập</th>
                            <th>Xóa</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.products.map((p) => (
                                <tr key={p.id}>
                                    <td>{p.id}</td>
                                    <td>
                                        {/* <img src={`data:image/jpeg;base64,${p.imageurl}`} alt="" height="100px"></img> */}
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
                                    <td><button onClick={(e) => this.onToggleFormDel(e, p.id)} className="btn btn-danger" disabled={p.status === 'Stop'}>
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
                        <ModalHeader toggle={this.onToggleForm}>Thêm Máy Mới</ModalHeader>
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

export default withRouter(Product);