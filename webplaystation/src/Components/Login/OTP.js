import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
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
        // console.log(this.props.location.state);
        // console.log(this.props.location.state.otp);
        this.setState({
			email: this.props.location.state.email,
			otp: this.props.location.state.otp
		})
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
        // console.log(this.state.confirm)
        // console.log(this.state.otp)
        if (parseInt(this.state.confirm) === this.state.otp)
        {
            this.props.history.push("/WebPlayStation/changpassword", {otp: this.state.otp, email: this.state.email});
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