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
		this.state = { username: '', password: ''};
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

	handleSubmit = () => {
		postLogin('/auth/signin', {username: this.state.username, password: this.state.password})
        .then((response) => {
            if (response.status === 200)
            {
                //console.log(response.data);
                localStorage.setItem('accessToken', response.data.accessToken);
				sessionStorage.setItem('user_id', response.data.id);
				sessionStorage.setItem('username', response.data.username);
                if (response.data.roles[0] === "ROLE_ADMIN" || response.data.roles[0] === "ROLE_PM")
                {
					alert('Login Successfully!');
					this.props.history.push("/admin");
					
				}
				else if (response.data.roles[0] === "ROLE_USER")
				{
					alert('Login Successfully!');
					this.props.history.push("/");
				}
            }
            
        })
        .catch(error => alert('Username or Password is wrong!'));
	}

	render() {
		return (
			<Segment style={{ padding: '8em 0em' }} placeholder>
				<Grid columns={2} relaxed='very' stackable>
				<Grid.Column width={8}>
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
						type='password' name='password' value={this.state.password} onChange={this.handleChange}
						required
					/>

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