import React, { Component } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

export default class Success extends Component {
    componentDidMount()
    {
        localStorage.setItem('shopping-cart', []);
    }

    render() {
        return (
            <div style={{marginTop:'50px'}}>
                <div className="row">
                    <div className="col-md-12 text-center">
                        {/* <i className="fas fa-check-circle fa-5x text-success"></i> */}
                        <FontAwesomeIcon icon={faCheckCircle} className="fas fa-check-circle fa-5x text-success"/>
                        <h2 className="display-3 text-black">Cám ơn!</h2>
                        <p className="lead mb-5">Bạn đã thanh toán thành công.</p>
                        <p><a href="/" className="btn btn-lg btn-primary">Quay về cửa hàng</a></p>
                    </div>
                </div>
            </div>
        )
    }
}
