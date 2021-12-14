import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { get } from '../../Utils/httpHelper';
import "./Login.css";

class OTP extends Component {
    constructor(props) {
		super(props);
		this.state = {
            email: "",
            otp: 0,
            confirm: 0,
            Error: "",
		    key: ""
        };
    }
    componentDidMount()
    {
        this.setState({
			email: this.props.location.state.email,
        })
        get(`/users/forgetPassword?email=${this.props.location.state.email}`)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    otp: response.data
                })
            }
        })
        .catch((error) => {});
		window.onbeforeunload = function () {
			window.history.replaceState(null, "");
		  }.bind(this);
    }
    
    handleChange(e){
        this.setState({
            [e.target.name]: e.target.value.trim()
        });
    }

    handleOTP(e)
    {
        e.preventDefault();
        if (parseInt(this.state.confirm) === this.state.otp)
        {
            this.props.history.push("/WebPlayStation/changpassword", {email: this.state.email});
        }
        else
        {
            this.setState({
				key: 'otp'
			})
			this.setState({
				Error: "Mã xác nhận không chính xác."
			});
			return;
        }
    }

    render() {
        return (
            <div>
                <div className="otp-form">
                    <h2>Nhập mã xác nhận</h2>
                    <h4>Mã OTP: </h4>
                    <form onSubmit={(e) => this.handleOTP(e)}>
                        <input type="number" name="confirm" onChange={(e) => this.handleChange(e)} placeholder="Nhập mã OTP..." required></input>
                        <br/>
                        {this.state.key === 'otp' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}<br/></span> : '' }
                        <button type="submit" className="btn-otp">Gửi</button>
                    </form>
                </div>
            </div>
        )
    }
}
export default withRouter(OTP);