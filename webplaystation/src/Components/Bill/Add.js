import React, { Component } from 'react';
import { Col, Row, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { get } from '../../Utils/httpHelper';

export default class Add extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            total: 0,
            user_id: "",
            billStatus_id: "",
            users: [],
            billStatus: [],
            Error: "",
            key: "",
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

        get("/billstatuses")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    billStatus: response.data
                });
            }
        })
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
            billStatus_id: "3"
        })

        this.props.onAdd(this.state);
    }

    handleClear = () => {
        this.setState({
            total: 0,
            user_id: "",
            billStatus_id: "",
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
                    <Label for="total">Total</Label>
                    <Input type="number" name="total" id="total" placeholder="VND" onChange={(e) => this.changeValue(e)} value = {this.state.total} required="required" disabled/>
                    {this.state.key === 'total' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                </FormGroup>
                
                <FormGroup className="mb-2">
                    <Label for="user">Customer</Label>
                    <Input type="select" name="user_id" id="user" onChange={(e) => this.changeValue(e)} multiple required>
                        {
                            this.state.users.map((u) => (
                                <option key={u.id} value={u.id}>{u.name}</option>
                            ))
                        }
                    </Input>
                </FormGroup>
                <div className="mb-5">
                    <Button type="submit" outline color="warning" >Add</Button>{' '}
                    <Button outline color="danger" onClick={this.handleClear.bind(this)}>Cancel</Button>
                </div>
                </Form>
            </div>
        )
    }
}
