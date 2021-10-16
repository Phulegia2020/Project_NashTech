import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import { Col, Row, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { get, put } from '../../Utils/httpHelper';
import "../Category/Category.css";

class UpdatePlaceOrder extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            id: this.props.match.params.id,
            total: 0,
            quantity: 0,
            user_id: "",
            status: "",
            users: [],
            suppliers: [],
            Error: "",
            key: "",
        }
    }
    
    componentDidMount(){
        get("/users/employee")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({users: response.data});
            }
        })
        .catch(error => {console.log(error)})

        get(`/placeorders/${this.state.id}`)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    total: response.data.total,
                    user_id: response.data.user_id,
                    supplier_id: response.data.supplier_id,
                    status: response.data.status
                })
            }
        });

        get("/suppliers")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    suppliers: response.data
                });
            }
        })
    }

    changeValue(e){
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleUpdate(event){
        event.preventDefault();
        put(`/placeorders/${this.state.id}`, {total: this.state.total, user_id: this.state.user_id, supplier_id: this.state.supplier_id, status: this.state.status})
        .then((response) => {
            if (response.status === 200)
            {
                this.props.history.push("/admin/placeorder");
            }
        })
    }

    handleClear = () => {
        this.setState({
            total: 0,
            quantity: 0,
            user_id: "",
            supplier_id: "",
        });
        this.props.history.push("/admin/placeorder");
    }

    componentWillUnmount() {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }

    render() {
        return (
            <div className="update-form">
                <h3>Update Place Order</h3>
                {/* <Row form>
                    <Col md={4}> */}
                        <Form onSubmit={(event) => this.handleUpdate(event)}>
                        <FormGroup>
                            <Label htmlFor="total">Total</Label>
                            <Input type="number" name="total" id="total" placeholder="VND" onChange={(e) => this.changeValue(e)} value = {this.state.total} disabled/>
                            {this.state.key === 'total' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                        </FormGroup>
                        <FormGroup className="mb-2">
                            <Label htmlFor="user">Employee</Label>
                            <Input type="select" name="user_id" id="user" value = {this.state.user_id} onChange={(e) => this.changeValue(e)}>
                                {
                                    this.state.users.map((u) => (
                                        <option key={u.id} value={u.id}>{u.name}</option>
                                    ))
                                }
                            </Input>
                        </FormGroup>
                        <FormGroup className="mb-2">
                            <Label htmlFor="supplier">Supplier</Label>
                            <Input type="select" name="supplier_id" id="supplier" value = {this.state.supplier_id} onChange={(e) => this.changeValue(e)}>
                                {
                                    this.state.suppliers.map((sup) => (
                                        <option key={sup.id} value={sup.id}>{sup.name}</option>
                                    ))
                                }
                            </Input>
                        </FormGroup>
                        <div className="mb-5">
                            <Button type="submit" outline color="warning" >Update</Button>{' '}
                            <Button outline color="danger" onClick={this.handleClear.bind(this)}>Cancel</Button>
                        </div>
                        </Form>
                    {/* </Col>
                </Row> */}
            </div>
        )
    }
}

export default withRouter(UpdatePlaceOrder);