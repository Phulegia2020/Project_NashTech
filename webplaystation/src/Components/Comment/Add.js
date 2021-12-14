import React, { Component } from 'react';
import { Button, Form, FormGroup, Label } from 'reactstrap';
import { get } from '../../Utils/httpHelper';

export default class Add extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            user_id: '',
            users: [],
            product_id: "",
            products: [],
            content: '',
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

        get("/products")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    products: response.data
                })
            }
        })
        .catch(error => {console.log(error)})
    }

    changeValue(e){
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleCreate(event){
        event.preventDefault();
        this.setState({
            product_id: event.target.product_id.value,
            content: ''
        })
        this.props.onAdd(this.state);
    }

    handleClear = () => {
        this.setState({
            content: '',
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
                    <Label htmlFor="content">Nội Dung</Label>
                    <textarea style={{resize: 'none', width: '470px'}} rows="3" type="text" name="content" id="content" placeholder="Bình luận..." onChange={(e) => this.changeValue(e)} value = {this.state.content} required="required"/>
                </FormGroup>
                <FormGroup className="mb-2">
                    <Label htmlFor="user">Người Dùng</Label>
                    <select name="user_id" id="user" className="form-control" size="5" onChange={(e) => this.changeValue(e)} required>
                        {
                            this.state.users.map((u) => (
                                <option key={u.id} value={u.id}>{u.name}</option>
                            ))
                        }
                    </select>
                </FormGroup>
                    
                <FormGroup className="mb-2">
                    <Label htmlFor="product">Sản Phẩm</Label>
                    <select name="product_id" id="product" className="form-control" size="5" onChange={(e) => this.changeValue(e)} required>
                        {
                            this.state.products.map((p) => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))
                        }
                    </select>
                </FormGroup>
                <div className="mb-5">
                    <Button type="submit" outline color="warning" >Thêm</Button>{' '}
                    <Button outline color="danger" onClick={this.handleClear.bind(this)}>Hủy</Button>
                </div>
                </Form>
            </div>
        )
    }
}
