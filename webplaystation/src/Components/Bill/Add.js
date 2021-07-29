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
        get("/users")
        .then((response) => {
            if (response.status === 200)
            {
                //console.log(response.data);
                this.setState({users: response.data});
            }
        })
        .catch(error => {console.log(error)})

        get("/billstatuses")
        .then((response) => {
            if (response.status === 200)
            {
                //console.log(response.data);
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

    handleCreate(event){
        event.preventDefault();
        if (event.target.total.value.trim() <= 0)
        {
            this.setState({
                key: 'total'
            })
            this.setState({
                Error: "Total price is not less than 1!"
            });
            return;
        }

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
                    <Input type="number" name="total" id="total" placeholder="VND" onChange={(e) => this.changeValue(e)} value = {this.state.total} required="required"/>
                    {this.state.key === 'total' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                </FormGroup>
                
                <FormGroup className="mb-2">
                    <Label for="user">User</Label>
                    <Input type="select" name="user_id" id="user" value = {this.state.user_id} onChange={(e) => this.changeValue(e)}>
                        {
                            this.state.users.map((u) => (
                                <option key={u.id} value={u.id}>{u.name}</option>
                            ))
                        }
                    </Input>
                </FormGroup>
                <FormGroup className="mb-5">
                    <Label for="status">Status</Label>
                    <Input type="select" name="billStatus_id" id="status" value = {this.state.billStatus_id} onChange={(e) => this.changeValue(e)}>
                        {
                            this.state.billStatus.map((bs) => (
                                <option key={bs.id} value={bs.id}>{bs.description}</option>
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
