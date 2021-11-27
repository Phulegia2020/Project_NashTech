import React, { Component } from 'react'
import { Col, Row, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { get } from '../../Utils/httpHelper';
import { Checkbox} from 'semantic-ui-react';

export default class Add extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            fullname: "",
            gender: "Male",
            address: "",
            email: "",
            phone: "",
            username: "",
            password: "",
            role: "",
            roles: [],
            blankError: "",
            key: "",
            users: [],
            show: false
        }
    }
    
    componentDidMount(){
        get("/users")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({users: response.data});
            }
        })
        .catch(error => {console.log(error)})

        get("/roles")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    roles: response.data
                });
            }
        })
    }

    changeValue(e){
        if (e.target.name === 'username' || e.target.name === 'phone' || e.target.name === 'email')
        {
            this.setState({
                [e.target.name]: e.target.value.trim()
            });
        }
        else{
            this.setState({
                [e.target.name]: e.target.value
            });
        }
    }

    async handleCreate(event){
        event.preventDefault();
        await this.setState({
            role: event.target.role.value
        })
        for (let i = 0; i < this.state.users.length; i++)
        {
            if (this.state.users[i].account === event.target.username.value.trim())
            {
                this.setState({
                    key: 'username'
                })
                this.setState({
                    blankError: "Tên tài khoản này đã được sử dụng!"
                });
                return;
            }
            if (this.state.users[i].email === event.target.email.value.trim())
            {
                this.setState({
                    key: 'email'
                })
                this.setState({
                    blankError: "Email này đã được sử dụng!"
                });
                return;
            }
            if (this.state.users[i].phone === event.target.phone.value.trim())
            {
                this.setState({
                    key: 'phone'
                })
                this.setState({
                    blankError: "Số điện thoại này đã được sử dụng!"
                });
                return;
            }
        }
        if (event.target.password.value.length < 6)
		{
			this.setState({
				key: 'password'
			})
			this.setState({
				blankError: "Mật khẩu có tối thiểu 6 ký tự!"
			});
			return;
        }
        if (event.target.phone.value.trim().length !== 10)
		{
			this.setState({
				key: 'phone'
			})
			this.setState({
				blankError: "Số điện thoại phải có 10 số!"
			});
			return;
        }
        if (event.target.phone.value[0] != 0)
		{
			this.setState({
				key: 'phone'
			})
			this.setState({
				blankError: "Số điện thoại phải bắt đầu bắng số 0!"
			});
			return;
        }
        this.setState({
            key: '',
            blankError: '',
        })
        this.props.onAdd(this.state);
    }

    handleClear = () => {
        this.setState({
            name: "",
            gender: "",
            address: "",
            email: "",
            phone: "",
            username: "",
            password: "",
            role: ""
        });
        this.props.onCloseForm();
    }

    handleShowPassword(e)
	{
		e.preventDefault();
		this.setState({
			show: !this.state.show
		})
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
                        <Label htmlFor="name">Họ Tên</Label>
                        <Input type="text" name="fullname" id="name" placeholder="Họ tên" onChange={(e) => this.changeValue(e)} value = {this.state.fullname} required/>
                    </FormGroup>
                    <FormGroup tag="fieldset" row>
                        <legend className="col-form-label col-sm-2">Giới Tính</legend>
                        <Form inline>
                            <FormGroup check>
                                <Label check>
                                <Input type="radio" name="gender" defaultChecked value = "Male" onChange={(e) => this.changeValue(e)}/>{' '}
                                Nam
                                </Label>
                            </FormGroup>

                            <FormGroup check>
                                <Label check>
                                <Input type="radio" name="gender" value = "Female" onChange={(e) => this.changeValue(e)} />{' '}
                                Nữ
                                </Label>
                            </FormGroup>
                        </Form>
                    </FormGroup>
                    <Row form>
                        <Col md={6}>
                            <FormGroup>
                                <Label htmlFor="username">Tài Khoản</Label>
                                <Input type="text" minLength="3" name="username" id="username" placeholder="ABC" onChange={(e) => this.changeValue(e)} value = {this.state.username} required/>
                                {this.state.key === 'username' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.blankError}</span> : '' }
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label htmlFor="password">Mật Khẩu</Label>
                                <Input type={this.state.show === false? 'password' : 'text'} minLength="6" name="password" id="password" placeholder="******" onChange={(e) => this.changeValue(e)} value = {this.state.password} required/>
                                {this.state.key === 'password' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.blankError}</span> : '' }
                                <Checkbox label='Hiển thị' onChange={(e) => this.handleShowPassword(e)}/>
                            </FormGroup>
                        </Col>
                    </Row>
                    <FormGroup>
                        <Label htmlFor="email">Email</Label>
                        <Input type="email" name="email" id="email" placeholder="abc@gmail.com" onChange={(e) => this.changeValue(e)} value = {this.state.email} required/>
                        {this.state.key === 'email' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.blankError}</span> : '' }
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="address">Địa Chỉ</Label>
                        <Input type="text" name="address" id="address" placeholder="1 Đường, Phường 2, Quận 3, Thành phố Hồ Chí Minh" onChange={(e) => this.changeValue(e)} value = {this.state.address} required/>
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="phone">Số Điện Thoại</Label>
                        <Input type="number" minLength="10" maxLength="10" name="phone" id="phone" placeholder="0123******" onChange={(e) => this.changeValue(e)} value = {this.state.phone} required/>
                        {this.state.key === 'phone' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.blankError}</span> : '' }
                    </FormGroup>
                    <FormGroup className="mb-2">
                        <Label htmlFor="role">Vai Trò</Label>
                        <Input type="select" name="role" id="role" onChange={(e) => this.changeValue(e)} required>
                            <option defaultValue="ADMIN">ADMIN</option>
                            <option value="STAFF">STAFF</option>
                            <option value="USER">USER</option>
                        </Input>
                    </FormGroup>
                    <div className="mb-1">
                        <Button type="submit" outline color="warning" >Thêm</Button>{' '}
                        <Button outline color="danger" onClick={this.handleClear.bind(this)}>Hủy</Button>
                    </div>
                    </Form>
            </div>
        )
    }
}
