import React, { Component } from 'react'
import {FormGroup, Label, Input, Button } from 'reactstrap';
import { postLogin } from '../../Utils/httpHelper';

export default class Login extends Component {
    state = {
        username:"",
        password:""
    }

    changeValue(e){
        //this.setState({name: e.target.value})
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleLogin(){
        postLogin('/auth/signin', {username: this.state.username, password: this.state.password})
        .then((response) => {
            if (response.status === 200)
            {
                console.log(response.data);
                localStorage.setItem('accessToken', response.data.accessToken);
                if (response.data.roles[0] === "ROLE_USER")
                {
                    //this.props.history.push("/user");
                    console.log(response.data.roles[0]);
                }
            }
            
        })
        .catch(error => console.log(error));
    }

    render() {
        return (
            <div>
                <FormGroup>
                    <Label for="username">Username</Label>
                    <Input type="text" name="username" id="username" placeholder="Football" onChange={(e) => this.changeValue(e)} value = {this.state.username} required/>
                </FormGroup>
                <FormGroup>
                    <Label for="password">Password</Label>
                    <Input type="password" name="password" id="password" placeholder="123456" onChange={(e) => this.changeValue(e)} value = {this.state.password} required/>
                </FormGroup>
                <Button type="submit" outline color="warning" onClick={this.handleLogin.bind(this)}>Login</Button>
            </div>
        )
    }
}
