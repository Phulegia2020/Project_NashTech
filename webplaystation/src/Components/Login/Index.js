import React, { Component } from 'react';
import { Button, Checkbox, Form } from 'semantic-ui-react';
import {
	Segment,
	Grid,
	Divider
} from 'semantic-ui-react'
import { postLogin } from '../../Utils/httpHelper';
import { withRouter } from "react-router";
import {Link} from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./Login.css";

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = { username: '', password: '', show: false};
	}

	handleChange = (e, { name, value }) => {
		if (name === 'username')
        {
            this.setState({
                [name]: value.trim()
            });
        }
		else
		{
			this.setState({ [name]: value });
		}
	}

	handleShowPassword(e)
	{
		e.preventDefault();
		this.setState({
			show: !this.state.show
		})
	}

	handleSubmit = () => {
		postLogin('/auth/signin', {username: this.state.username, password: this.state.password})
        .then((response) => {
            if (response.status === 200)
            {
				localStorage.setItem('accessToken', response.data.accessToken);
				localStorage.setItem('role', response.data.roles[0]);
				localStorage.setItem('user_id', response.data.id);
				localStorage.setItem('username', response.data.username);
                if (response.data.roles[0] === "ADMIN" || response.data.roles[0] === "STAFF")
                {
					this.props.history.push("/admin");
					window.location.reload();
					
				}
				else if (response.data.roles[0] === "USER")
				{
					this.props.history.push("/");
					window.location.reload();
				}
            }
            
        })
		.catch(error => toast.error('Tài khoản hoặc mật khẩu không hợp lệ!'));
	}

	render() {
		return (
			<div className="login-form">
				<Segment style={{ padding: '8em 0em', marginTop: '4rem' }} placeholder>
					<Grid columns={2} relaxed='very' stackable>
						<Grid.Column width={8}>
							<h2  className="login-title">ĐĂNG NHẬP</h2>
							<Form onSubmit={(event) => this.handleSubmit(event)}>
								<Form.Input
									icon='user'
									iconPosition='left'
									label='Tài Khoản'
									placeholder='Tên Tài Khoản... '
									name='username' value={this.state.username} onChange={this.handleChange}
									required
								/>
								<Form.Input
									icon='lock'
									iconPosition='left'
									label='Mật Khẩu'
									type='password'
									placeholder='Mật Khẩu... '
									type={this.state.show === false ? 'password' : 'text'}
									name='password' value={this.state.password} onChange={this.handleChange}
									required
								/>
								<Form.Field>
									<Checkbox label='Hiển thị' onChange={(e) => this.handleShowPassword(e)}/>
								</Form.Field>
								<Button type='submit' content='Đăng nhập' primary/>
							</Form>
							<Link to={`/WebPlayStation/forgetPassword`} style={{ textDecoration: 'none' }} className="forget-password">Quên Mật Khẩu?</Link>
						</Grid.Column>
						
						<Grid.Column verticalAlign='middle'>
							<Button as={Link} to="/WebPlayStation/signup" content='ĐĂNG KÝ' icon='signup' size='big' id="btn-signup"/>
						</Grid.Column>
					</Grid>

					<Divider vertical>Nếu Bạn Chưa Có Tài Khoản. Đăng Ký Ở Đây?</Divider>
					<ToastContainer position="top-center"
						autoClose={2000}
						hideProgressBar
						newestOnTop={false}
						closeOnClick={false}
						rtl={false}
						pauseOnFocusLoss
						draggable
						pauseOnHover
						style={{width: '350px'}}/>
				</Segment>
			</div>
		);
	}
}

export default withRouter(Login); 