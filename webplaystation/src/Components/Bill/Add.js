import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { get } from '../../Utils/httpHelper';

export default class Add extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            total: 0,
            user_id: "",
            // billStatus_id: "",
            status: '',
            users: [],
            billStatus: [],
            Error: "",
            key: "",
            destination: '',
            payment: 'Cod'
        }
    }
    
    componentDidMount(){
        get("/users/customer")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({users: response.data});
            }
        })
        .catch(error => {console.log(error)})

        // get("/billstatuses")
        // .then((response) => {
        //     if (response.status === 200)
        //     {
        //         this.setState({
        //             billStatus: response.data
        //         });
        //     }
        // })
    }

    changeValue(e){
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    async handleCreate(event){
        event.preventDefault();
        await this.setState({
            user_id: event.target.user_id.value,
            // billStatus_id: "3"
            status: 'Waiting'
        })

        this.props.onAdd(this.state);
    }

    handleClear = () => {
        this.setState({
            total: 0,
            user_id: "",
            // billStatus_id: "",
            status: "",
        });
        this.props.onCloseForm();
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
                <Form onSubmit={(event) => this.handleCreate(event)}>
                <FormGroup>
                    <Label htmlFor="total">Tổng Tiền</Label>
                    <Input type="number" name="total" id="total" placeholder="VND" onChange={(e) => this.changeValue(e)} value = {this.state.total} required="required" disabled/>
                    {this.state.key === 'total' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                </FormGroup>
                
                <FormGroup className="mb-2">
                    <Label htmlFor="user">Khách Hàng</Label>
                    {/* <Input type="select" name="user_id" id="user" onChange={(e) => this.changeValue(e)} multiple required>
                        {
                            this.state.users.map((u) => (
                                <option key={u.id} value={u.id}>{u.name}</option>
                            ))
                        }
                    </Input> */}
                    <select name="user_id" id="user" className="form-control" size="5" onChange={(e) => this.changeValue(e)} required>
                        {
                            this.state.users.map((u) => (
                                <option key={u.id} value={u.id}>{u.name}</option>
                            ))
                        }
                    </select>
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="destination">Địa điểm giao hàng</Label>
                    <Input type="text" name="destination" id="destination" placeholder="Địa điểm giao hàng..." onChange={(e) => this.changeValue(e)} value = {this.state.destination} required="required"/>
                    
                </FormGroup>
                <FormGroup tag="fieldset" row>
                    <Label htmlFor="payment">Thanh Toán</Label>
                    <Form inline>
                        <FormGroup check>
                            <Label check>
                            <Input type="radio" name="payment" defaultChecked value = "Cod" onChange={(e) => this.changeValue(e)}/>{' '}
                            Tiền Mặt
                            </Label>
                        </FormGroup>

                        <FormGroup check>
                            <Label check>
                            <Input type="radio" name="payment" value = "PayPal" onChange={(e) => this.changeValue(e)} />{' '}
                            PayPal
                            </Label>
                        </FormGroup>
                    </Form>
                </FormGroup>
                <div className="mt-3">
                    <Button type="submit" outline color="warning" >Tạo</Button>{' '}
                    <Button outline color="danger" onClick={this.handleClear.bind(this)}>Hủy</Button>
                </div>
                </Form>
            </div>
        )
    }
}
