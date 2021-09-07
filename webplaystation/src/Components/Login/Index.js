import React, { Component } from 'react';
import { Button, Checkbox, Form } from 'semantic-ui-react';
import {
	Segment,
	Grid,
	Divider
} from 'semantic-ui-react'
import { postLogin } from '../../Utils/httpHelper';
import { withRouter } from "react-router";
import MainMenu from '../HomePage/MainMenu/MainMenu';
import { render } from 'react-dom';
import {Link} from 'react-router-dom';

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
        .catch(error => alert('Username or Password is wrong!'));
	}

	render() {
		return (
			<Segment style={{ padding: '8em 0em', marginTop: '6rem' }} placeholder>
				<Grid columns={2} relaxed='very' stackable>
				<Grid.Column width={8}>
					<h2 style={{ marginLeft: '355px', marginBottom: '25px' }}>Sign In</h2>
					<Form onSubmit={(event) => this.handleSubmit(event)}>
					<Form.Input
						icon='user'
						iconPosition='left'
						label='Username'
						placeholder='Enter Username '
						name='username' value={this.state.username} onChange={this.handleChange}
						required
					/>
					<Form.Input
						icon='lock'
						iconPosition='left'
						label='Password'
						type='password'
						placeholder='Enter Password '
						type={this.state.show === false ? 'password' : 'text'}
						name='password' value={this.state.password} onChange={this.handleChange}
						required
					/>
					<Form.Field>
						<Checkbox label='Show password' onChange={(e) => this.handleShowPassword(e)}/>
					</Form.Field>
					<Button type='submit' content='Login' primary/>
					</Form>
				</Grid.Column>

				
				<Grid.Column verticalAlign='middle'>
					<Button as={Link} to="/WebPlayStation/signup" content='Sign up' icon='signup' size='big' />
				</Grid.Column>
				</Grid>

				<Divider vertical>If you do not have an acount. Register?</Divider>
			</Segment>
		);
	}
}

export default withRouter(Login); 