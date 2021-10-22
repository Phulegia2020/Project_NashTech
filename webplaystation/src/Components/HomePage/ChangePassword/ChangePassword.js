import React, { Component } from 'react';
import {
    Button,
    Grid,
    Segment,
	Form,
	Checkbox
} from 'semantic-ui-react';
import {post} from './../../../Utils/httpHelper';
import "../SignUp/SignUp.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class ChangePassword extends Component {
    constructor(props) {
		super(props);
		this.state = { newpassword: '', confirmpassword: '', Error: "",
		key: "", show: false};
	}

	handleChange = (e, { name, value }) => {
		this.setState({ [name]: value });
	}

    handleSubmit = (event) => {
		if (event.target.newpassword.value.length < 6)
		{
			this.setState({
				key: 'password'
			})
			this.setState({
				Error: "Password is at least 6 characters!"
			});
			return;
		}
		if (event.target.newpassword.value !== event.target.confirmpassword.value)
		{
			this.setState({
				key: 'confirmpassword'
			})
			this.setState({
				Error: "Confirm Password is not correct!"
			});
			return;
		}
		post('/auth/profile', {user_id: localStorage.getItem('user_id'), newpassword: this.state.newpassword,
                                            confirmpassword: this.state.confirmpassword})
        .then((response) => {
            if (response.status === 200)
            {
				// alert(response.data.message);
				toast.success('Thay đổi mật khẩu thành công!')
				this.setState({
					newpassword: "",
					confirmpassword: "",
					Error: ""
				});
            }
            
        })
		// .catch(error => alert('Check Password again!'));
		.catch(error => toast.error('Kiểm tra lại mật khẩu!'));
	}

	handleShowPassword(e)
	{
		e.preventDefault();
		this.setState({
			show: !this.state.show
		})
	}

    render() {
        return (
			<div className="password-form">
            <Segment style={{ padding: '8em 0em' }} vertical>
				<Grid container stackable verticalAlign='middle'>
					<Grid.Row>
						<Grid.Column width={8}>
							<h2 className="title-profile">Thay Đổi Mật Khẩu</h2>
							<Form onSubmit={(event) => this.handleSubmit(event)}>
								<Form.Field>
									<label>Mật Khẩu Mới</label>
									<Form.Input placeholder='Nhập mật khẩu mới...' type={this.state.show === false ?'password' : 'text'} name='newpassword' value={this.state.newpassword} onChange={this.handleChange} required/>
									{this.state.key === 'password' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}<br></br></span> : '' }
									<Checkbox label='Hiển thị' onChange={(e) => this.handleShowPassword(e)}/>
								</Form.Field>
								<Form.Field>
									<label>Nhập Lại Mật Khẩu</label>
									<Form.Input placeholder='Nhập lại mật khẩu...' type='password' name='confirmpassword' value={this.state.confirmpassword} onChange={this.handleChange} required/>
									{this.state.key === 'confirmpassword' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
								</Form.Field>
								<Button type='submit' color="twitter">XÁC NHẬN</Button>
							</Form>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</Segment>
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
