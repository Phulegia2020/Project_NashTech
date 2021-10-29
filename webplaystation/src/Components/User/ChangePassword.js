import React, { Component } from 'react';
import { Col, Row, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import {get, post} from '../../Utils/httpHelper';
import { Checkbox, Breadcrumb} from 'semantic-ui-react';
import './User.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class ChangePassword extends Component {
    constructor(props) {
		super(props);
		this.state = { newpassword: '', confirmpassword: '', Error: "",
		key: "", show: false, user: {}, change: true};
    }
    
    componentDidMount()
    {
        get(`/users/${localStorage.getItem('user_id')}`)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    user: response.data
                })
            }
        })
    }

	// changeValue = (e, { name, value }) => {
	// 	this.setState({ [name]: value });
    // }
    
    changeValue(e){
        this.setState({
            [e.target.name]: e.target.value
        }, () => this.validate());
    }

    validate()
    {
        if (this.state.newpassword !== '')
        {
            this.setState({
                change: false
            })
        }
        else{
            this.setState({
                change: true
            })
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
		if (event.target.newpassword.value.length < 6)
		{
			this.setState({
				key: 'password'
			})
			this.setState({
				Error: "Mật khẩu có tối thiểu 6 ký tự."
			});
			return;
        }
        // console.log(localStorage.getItem('user_id'));
        // console.log(this.state.newpassword);
        // console.log(this.state.confirmpassword);
		post('/auth/profile', {user_id: localStorage.getItem('user_id'), newpassword: this.state.newpassword,
                                            confirmpassword: this.state.confirmpassword})
        .then((response) => {
            if (response.status === 200)
            {
                // alert(response.data.message);
                toast.success('Thay đổi mật khẩu thành công!');
				this.setState({
					newpassword: "",
					confirmpassword: ""
				});
            }
            
        })
        // .catch(error => alert('Check Password again!'));
        .catch(error => toast.error('Kiểm tra lại xác nhận mật khẩu'));
    }

    handleShowPassword(e)
	{
		e.preventDefault();
		this.setState({
			show: !this.state.show
		})
	}
    
    render() {
        const sections = [
            { key: 'Quản Lý', content: 'Quản Lý', link: false },
            { key: 'Thông tin tài khoản', content: 'Thông tin tài khoản', active: true }
          ]
        return (
            <div className='change-pro'>
                <Breadcrumb icon='right angle' sections={sections} size='large'/>
                <div className="change-password">
                    <h3>Thay Đổi Mật Khẩu</h3>
                    <Row form>
                        <Col md={10}>
                            <Form onSubmit={(event) => this.handleSubmit(event)}>
                                <FormGroup style={{marginBottom: '10px', marginLeft: '50px'}}>
                                    <Label htmlFor="newPassword">Mật Khẩu Mới</Label>
                                    <Input type={this.state.show === false? 'password' : 'text'} minLength="6" name="newpassword" id="newPassword" placeholder="Nhập mật khẩu mới..." onChange={(e) => this.changeValue(e)} value = {this.state.newpassword} required/>
                                    {this.state.key === 'password' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                                    <Checkbox label='Show password' onChange={(e) => this.handleShowPassword(e)}/>
                                </FormGroup>
                                <FormGroup style={{marginBottom: '10px', marginLeft: '50px'}}>
                                    <Label htmlFor="confirmpassword">Nhập Lại Mật Khẩu</Label>
                                    <Input type="password" name="confirmpassword" id="confirmpassword" placeholder="Nhập Lại Mật Khẩu..." onChange={(e) => this.changeValue(e)} value = {this.state.confirmpassword} required/>
                                    {/* {this.state.key === 'password' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' } */}
                                </FormGroup>
                                <Button type='submit' style={{marginTop: '10px', marginLeft: '50px'}} color='success' disabled={this.state.change}>Xác Nhận</Button>
                            </Form>
                        </Col>
                    </Row>
                </div>
                <div className='profile'>
                    <h3 style={{fontWeight:'bold'}}>Thông Tin Nhân Viên</h3>
                    <p><b>Họ và tên:</b> {this.state.user.name}</p>
                    <p><b>Tài Khoản:</b> {this.state.user.account}</p>
                    { this.state.user.gender === 'Male' && <p><b>Giới tính:</b> Nam</p>}
                    { this.state.user.gender === 'Female' && <p><b>Giới tính:</b> Nữ</p>}
                    <p><b>Địa chỉ:</b> {this.state.user.address}</p>
                    <p><b>Email:</b> {this.state.user.email}</p>
                    <p><b>Số Điện Thoại:</b> {this.state.user.phone}</p>
                    {localStorage.getItem('role') === 'ADMIN' && <p><b>Chức vụ:</b> Quản trị viên</p>}
                    {localStorage.getItem('role') === 'STAFF' && <p><b>Chức vụ:</b> Nhân viên</p>}
                </div>
                <ToastContainer position="top-center"
                    autoClose={2000}
                    hideProgressBar
                    newestOnTop={false}
                    closeOnClick={false}
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
					/>
            </div>
        )
    }
}
