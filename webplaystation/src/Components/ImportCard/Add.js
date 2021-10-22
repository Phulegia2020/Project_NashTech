import React, { Component } from 'react'
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { get } from '../../Utils/httpHelper';

export default class Add extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            total: 0,
            quantity: 0,
            user_id: localStorage.getItem('user_id'),
            placeorder_id: "",
            placeorders: [],
            placehorder_quantity: 0,
            Error: "",
            key: "",
        }
    }
    
    componentDidMount(){
        get("/placeorders/notDone")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({placeorders: response.data});
            }
        })
        .catch(error => {console.log(error)})
    }

    changeValue(e){
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    async handleCreate(event){
        event.preventDefault();
        await this.setState({
            placeorder_id: event.target.placeorder_id.value
        })
        this.props.onAdd(this.state);
    }

    handleClear = () => {
        this.setState({
            total: 0,
            quantity: 0,
            user_id: "",
            placeorder_id: "",
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
                    <Input type="number" name="total" id="total" placeholder="VND" onChange={(e) => this.changeValue(e)} value = {this.state.total} disabled/>
                    {this.state.key === 'total' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                </FormGroup>
                <FormGroup className="mb-2">
                    <Label htmlFor="placeorder">Phiếu Đặt</Label>
                    <Input type="select" name="placeorder_id" id="placeorder" onChange={(e) => this.changeValue(e)}>
                        {
                            this.state.placeorders.map((po) => (
                                <option key={po.id} value={po.id}>{po.id}</option>
                            ))
                        }
                    </Input>
                </FormGroup>
                <div className="mb-5">
                    <Button type="submit" outline color="warning" >Tạo</Button>{' '}
                    <Button outline color="danger" onClick={this.handleClear.bind(this)}>Hủy</Button>
                </div>
                </Form>
            </div>
        )
    }
}
