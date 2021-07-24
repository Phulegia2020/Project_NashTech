import React, { Component } from 'react';
import {
    Button,
    Modal,
    Grid,
    Segment,
    Form,
    Checkbox,
} from 'semantic-ui-react';
import {post} from './../../../Utils/httpHelper'

export default class ChangePassword extends Component {
    constructor(props) {
		super(props);
		this.state = { newpassword: '', confirmpassword: ''};
	}

	handleChange = (e, { name, value }) => {
		this.setState({ [name]: value });
	}

    handleSubmit = () => {
		post('/auth/profile', {user_id: sessionStorage.getItem('user_id'), newpassword: this.state.newpassword,
                                            confirmpassword: this.state.confirmpassword})
        .then((response) => {
            if (response.status === 200)
            {
                alert(response.data.message);
                //window.location.reload();
            }
            
        })
        .catch(error => alert('Check Password again!'));
	}

    render() {
        return (
            <Segment style={{ padding: '8em 0em' }} vertical>
				<Grid container stackable verticalAlign='middle'>
					<Grid.Row>
						<Grid.Column width={8}>
							<Form onSubmit={this.handleSubmit}>
								<Form.Field>
									<label>New Password</label>
									<Form.Input placeholder='Enter New Password' type='password' name='newpassword' value={this.state.newpassword} onChange={this.handleChange} required/>
								</Form.Field>
								<Form.Field>
									<label>Confirm Password</label>
									<Form.Input placeholder='Confirm New Password' type='password' name='confirmpassword' value={this.state.confirmpassword} onChange={this.handleChange} required/>
								</Form.Field>
								<Form.Field>
									<Checkbox label='Remember me' />
								</Form.Field>
								<Button type='submit'>Confirm</Button>
							</Form>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</Segment>
        )
    }
}
