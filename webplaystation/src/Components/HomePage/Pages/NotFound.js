import React, { Component } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faExclamationCircle} from "@fortawesome/free-solid-svg-icons";

export default class NotFound extends Component {
    render() {
        return (
            <div style={{marginTop:'50px'}}>
                <div className="row">
                    <div className="col-md-12 text-center">
                        {/* <i class="fas fa-check-circle fa-5x text-success"></i> */}
                        <FontAwesomeIcon icon={faExclamationCircle} className="fas fa-check-circle fa-5x text-danger"/>
                        <h2 className="display-3 text-black">404</h2>
                        <p className="lead mb-5">Không tìm thấy trang</p>
                        <p><a href="/" className="btn btn-lg btn-primary">Tiếp tục mua sắm</a></p>
                    </div>
                </div>
            </div>
        )
    }
}
