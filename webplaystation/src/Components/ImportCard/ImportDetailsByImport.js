import React, { Component } from 'react'
import { get, del, post } from '../../Utils/httpHelper'
import { formatCurrency, formatQuantity } from '../../Utils/Utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import Add from '../ImportDetails/Add';
import { withRouter } from "react-router";

class ImportDetailsByImport extends Component {
    state = {
        id: this.props.match.params.id,
        importdetails: [],
        import: {},
        isDisplayForm: false,
        isDisplayFormDel: false,
        iddel: {},
        pageNumber: 0,
        pageToTal: 0,
    }

    componentDidMount(){
        get(`/importDetails/import/${this.state.id}`)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    //importdetails: response.data
                    pageToTal: Math.ceil(response.data.length / 5)
                })
            }
        })

        get(`/importDetails/importPage/${this.state.id}?pageNumber=0&pageSize=5&sortBy=id`)
        .then((response) => {
            this.setState({
                importdetails: response.data
            });
        })
        .catch(error => console.log(error));

        get(`/imports/${this.state.id}`)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    import: response.data
                })
            }
        })
    }

    delImportDetail = (e, id) =>
    {
        e.preventDefault();
        del(`/importDetails/${id.imp_id}-${id.product_id}`)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({importdetails: this.state.importdetails.filter(b => `${b.imp_id}-${b.product_id}` !== `${id.imp_id}-${id.product_id}`), isDisplayFormDel: false})
            }
        })
        .catch(error => {console.log(error)})
    }

    createImportDetail(newImportDetail){
        post(`/importDetails`, {quantity: newImportDetail.quantity, price: newImportDetail.price, product_id: newImportDetail.product_id, imp_id: newImportDetail.import_id})
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    importdetails: [...this.state.importdetails, response.data],
                    isDisplayForm: false,
                })
            }
        })
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
        this.createImportDetail(data);
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
        
        get(`/importDetails/importPage/${this.state.id}?pageNumber=${pageNumber}&pageSize=5&sortBy=id`)
        .then((response) => {
            this.setState({
                importdetails: response.data,
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
                        Are you sure?
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={(e) => this.delImportDetail(e, this.state.iddel)} className="btn-danger">Delete</Button>
                        <Button onClick={(e) => this.onCloseFormDel(e)}>Close</Button>
                    </ModalFooter>
                </Modal>
                <button type="button" className="btn btn-primary" onClick={this.onToggleForm} disabled>
                    <FontAwesomeIcon icon={faPlus} className="mr-2"/>{' '}
                    Creat New Import Detail
                </button>
                <table id="table">
                    <thead>
                        <tr>
                            <th><b>No.</b></th>
                            <th><b>Product</b></th>
                            <th><b>Product_Name</b></th>
                            <th><b>Quantity</b></th>
                            <th><b>Price</b></th>
                            <th>Update</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.importdetails.map((imp, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <img src={`data:image/jpeg;base64,${imp.productImg}`} alt="" height="100px"></img>
                                    </td>
                                    <td>{imp.productName}</td>
                                    <td>{formatQuantity(imp.quantity)}</td>
                                    <td>{formatCurrency(imp.price)}</td>
                                    <td>
                                        <Link to={`/admin/importDetails/update/${imp.imp_id}-${imp.product_id}`}  onClick={this.state.import.status !== 'Waiting' ? (e) => e.preventDefault() : ''} className={this.state.import.status !== 'Waiting' ? "disable-link" : ""}>
                                            <button className="btn btn-success" disabled={this.state.import.status !== 'Waiting'}>
                                            <FontAwesomeIcon icon={faEdit} className="mr-2"/>{' '}
                                                
                                            </button>
                                        </Link>
                                    </td>
                                    <td><button onClick={(e) => this.onToggleFormDel(e, imp)} className="btn btn-danger" disabled={this.state.import.status !== 'Waiting'}>
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
                        <ModalHeader toggle={this.onToggleForm}>Create New Import Detail</ModalHeader>
                        <ModalBody>
                            <Add onAdd={this.onAdd} onCloseForm={this.onCloseForm} import={this.state.id} importDet={this.state.importdetails}/>
                        </ModalBody>
                        <ModalFooter>
                        </ModalFooter>
                    </Modal>
                </div>
            </div>
        )
    }
}

export default withRouter(ImportDetailsByImport);