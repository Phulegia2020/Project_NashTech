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
                    Error: "This supplier is existed in list management at store!"
                });
                return;
            }
            if (this.state.suppliers[i].address === event.target.address.value.trim())
            {
                this.setState({
                    key: 'address'
                })
                this.setState({
                    Error: "This address is existed in list management at store!"
                });
                return;
            }
            if (this.state.suppliers[i].phone === event.target.phone.value.trim())
            {
                this.setState({
                    key: 'phone'
                })
                this.setState({
                    Error: "This phone is existed!"
                });
                return;
            }
        }
        if (!checkPhoneNumber(event.target.phone.value.trim()))
        {
            console.log('error')
            this.setState({
                key: 'phone'
            })
            this.setState({
                Error: "Phone must be numbers and start with 0!"
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
                        <Label for="name">Name</Label>
                        <Input type="text" name="name" id="name" placeholder="PS5" onChange={(e) => this.changeValue(e)} value = {this.state.name} required="required"/>
                        {this.state.key === 'supplier' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                    </FormGroup>
                    <FormGroup>
                        <Label for="address">Address</Label>
                        <Input type="text" name="address" id="address" placeholder="1 Street, 2 Ward, 3 District, Ho Chi Minh City" onChange={(e) => this.changeValue(e)} value = {this.state.address} required="required"/>
                        {this.state.key === 'address' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                    </FormGroup>
                    <FormGroup>
                        <Label for="phone">Phone</Label>
                        <Input type="text" name="phone" id="phone" minLength="10" maxLength="10" placeholder="0123456789" onChange={(e) => this.changeValue(e, 'phone')} value = {this.state.phone} required="required"/>
                        {this.state.key === 'phone' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                    </FormGroup>
                    <div className="mt-3">
                        <Button type="submit" outline color="warning">Add</Button>{' '}
                        <Button outline color="danger" onClick={this.handleClear.bind(this)}>Cancel</Button>
                    </div>
                </Form>
            </div>
        )
    }
}
