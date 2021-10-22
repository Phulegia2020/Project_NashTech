import React, { Component } from 'react'
import { checkPhoneNumber } from '../../Utils/Utils';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { get } from '../../Utils/httpHelper';

export default class Add extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            name: "",
            address: "",
            phone: "",
            Error: "",
            key: "",
            suppliers: []
        }
    }
    
    componentDidMount(){
        get("/suppliers")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({suppliers: response.data});
            }
        })
        .catch(error => {console.log(error)})
    }

    changeValue(e, key){
        if (key == 'phone')
        {
            this.setState({
                [e.target.name]: e.target.value.trim()
            });
        }
        else
        {
            this.setState({
                [e.target.name]: e.target.value
            });
        }
    }

    handleCreate(event){
        event.preventDefault();

        for (let i = 0; i < this.state.suppliers.length; i++)
        {
            if (this.state.suppliers[i].name === event.target.name.value.trim())
            {
                this.setState({
                    key: 'supplier'
                })
                this.setState({
                    Error: "Tên nhà cung cấp đã có tại cửa hàng!"
                });
                return;
            }
            if (this.state.suppliers[i].address === event.target.address.value.trim())
            {
                this.setState({
                    key: 'address'
                })
                this.setState({
                    Error: "Địa chỉ nhà cung cấp đã có tại của hàng!"
                });
                return;
            }
            if (this.state.suppliers[i].phone === event.target.phone.value.trim())
            {
                this.setState({
                    key: 'phone'
                })
                this.setState({
                    Error: "Số điện thoại nhà cung cấp đã có tại cửa hàng!"
                });
                return;
            }
        }
        if (!checkPhoneNumber(event.target.phone.value.trim()))
        {
            // console.log('error')
            this.setState({
                key: 'phone'
            })
            this.setState({
                Error: "Số điện thoại nên bắt đầu bằng số 0!"
            });
            return;
        }
        this.setState({
            key: '',
            Error: ''
        })

        this.props.onAdd(this.state);
    }

    handleClear = () => {
        this.setState({
            name: '',
            description: ''
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
                        <Label htmlFor="name">Tên</Label>
                        <Input type="text" name="name" id="name" placeholder="NCC" onChange={(e) => this.changeValue(e)} value = {this.state.name} required="required"/>
                        {this.state.key === 'supplier' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="address">Địa Chỉ</Label>
                        <Input type="text" name="address" id="address" placeholder="1 Đường, Phường 2, Quận 3, Thành phố Hồ Chí Minh" onChange={(e) => this.changeValue(e)} value = {this.state.address} required="required"/>
                        {this.state.key === 'address' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="phone">Số Điện Thoại</Label>
                        <Input type="text" name="phone" id="phone" minLength="10" maxLength="10" placeholder="0123456789" onChange={(e) => this.changeValue(e, 'phone')} value = {this.state.phone} required="required"/>
                        {this.state.key === 'phone' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                    </FormGroup>
                    <div className="mt-3">
                        <Button type="submit" outline color="warning">Thêm</Button>{' '}
                        <Button outline color="danger" onClick={this.handleClear.bind(this)}>Hủy</Button>
                    </div>
                </Form>
            </div>
        )
    }
}
