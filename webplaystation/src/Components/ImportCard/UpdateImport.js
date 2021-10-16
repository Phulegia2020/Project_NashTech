import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import { Col, Row, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { get, put } from '../../Utils/httpHelper';
import "../Category/Category.css"

class UpdateImport extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            id: this.props.match.params.id,
            total: 0,
            quantity: 0,
            user_id: "",
            placeorder_id: "",
            status: "",
            users: [],
            placeorders: [],
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

        get(`/imports/${this.state.id}`)
        .then((response) => {
            console.log(response.data);
            if (response.status === 200)
            {
                this.setState({
                    total: response.data.total,
                    quantity: response.data.quantity,
                    user_id: response.data.user_id,
                    placeorder_id: response.data.placeOrder_id,
                    status: response.data.status
                })
            }
        });

        get("/placeorders")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    placeorders: response.data
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
        put(`/imports/${this.state.id}`, {total: this.state.total, user_id: this.state.user_id, placeOrder_id: this.state.placeorder_id, status: this.state.status})
        .then((response) => {
            if (response.status === 200)
            {
                this.props.history.push("/admin/import");
            }
        })
    }

    handleClear = () => {
        this.setState({
            total: 0,
            quantity: 0,
            user_id: "",
            placeorder_id: "",
        });
        this.props.history.push("/admin/import");
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
                <h3>Update Import</h3>
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
                            <Label htmlFor="placeorder">Place Order</Label>
                            <Input type="select" name="placeorder_id" id="placeorder" value = {this.state.placeorder_id} onChange={(e) => this.changeValue(e)} disabled>
                                {
                                    this.state.placeorders.map((po) => (
                                        <option key={po.id} value={po.id}>{po.id}</option>
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

export default withRouter(UpdateImport);