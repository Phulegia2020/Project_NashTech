import React, { Component } from 'react';
import {
    Button,
    Grid,
    Segment,
	Form,
	Checkbox
} from 'semantic-ui-react';
import {get, post} from './../../../Utils/httpHelper';
import "../SignUp/SignUp.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { withRouter } from 'react-router-dom';

class ChangePassword extends Component {
    constructor(props) {
		super(props);
		this.state = { newpassword: '', confirmpassword: '', Error: "",
		key: "", show: false, email: "", otp: 0};
	}

	componentDidMount()
	{
		if (this.props.location.state != null)
		{
			// console.log(this.props.location.state.email);
			// console.log(this.props.location.state.otp);
			this.setState({
				email: this.props.location.state.email,
				otp: this.props.location.state.otp
			})
			window.onbeforeunload = function () {
				window.history.replaceState(null, "");
			}.bind(this);
		}
		
	}

	handleChange = (e, { name, value }) => {
		this.setState({ [name]: value });
	}

    async handleSubmit(event) {
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
		if (event.target.newpassword.value !== event.target.confirmpassword.value)
		{
			this.setState({
				key: 'confirmpassword'
			})
			this.setState({
				Error: "Xác nhận mật khẩu không chính xác."
			});
			return;
		}
		var id;
		if (localStorage.getItem('user_id') !== null)
		{
			id = localStorage.getItem('user_id');
		}
		else
		{
			if (this.state.email !== "")
			{
				await get(`/users/email/${this.state.email}`)
				.then((response) => {
					if (response.status === 200)
					{
						id = response.data.id;
						// console.log(id);
					}
				})
				.catch((error) => console.log(error));
			}
		}
		console.log(id);
		post('/auth/profile', {user_id: id, newpassword: this.state.newpassword,
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
				if (localStorage.getItem('user_id') === null)
				{
					setTimeout(() => window.location.href="/WebPlayStation/login", 2000);
				}
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
							{localStorage.getItem('user_id') !== null ? <h2 className="title-profile">Thay Đổi Mật Khẩu</h2> : <h2 className="title-profile">Nhập Mật Khẩu Mới</h2>}
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
export default withRouter(ChangePassword);