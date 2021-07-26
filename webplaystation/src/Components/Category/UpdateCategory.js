import React, { Component } from 'react'
import { Row, Col } from 'reactstrap';
import { withRouter } from "react-router";
import { put, get } from '../../Utils/httpHelper';

class UpdateCategory extends React.Component {

    state = {
        id: this.props.match.params.id,
        name: "",
        description: ""
    }

    componentDidMount(){
        get(`/categories/${this.state.id}`)
        .then((response) => {
            if (response.status === 200)
            {
                //console.log(response.data);
                // alert(`${id} is found`);
                this.setState({
                    name: response.data.name,
                    description: response.data.description
                })
            }
        })
    }

    changeValue(e){
        //this.setState({name: e.target.value})
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleUpdate(event){
        event.preventDefault();
        //this.props.onUpdate(this.state);
        put(`/categories/${this.state.id}`, {name: this.state.name, description: this.state.description})
        .then((response) => {
            if (response.status === 200)
            {
                //console.log(response.data);
                this.props.history.push("/admin/category");
            }
        })
    }

    handleClear = () => {
        this.setState({
            name: '',
            description: ''
        });
        // this.props.onCloseForm();
        // console.log(this.state);
        this.props.history.push("/admin/category");
    }

    render() {
        return (
            <div>
                <div className="container">
                    <div className="row">
                        <div className="col-md-4">
                            <h1>Update Category</h1>
                            <Row form>
                                <Col md={6}>
                                    <div className="form-group">
                                        <label>Name</label>
                                        <input type="text" name="name" className="form-control" onChange={(e) => this.changeValue(e)} value = {this.state.name} required/>
                                    </div>
                                </Col>
                            </Row>
                            <Row form>
                                <Col md={6}>
                                    <div className="form-group">
                                        <label>Description</label>
                                        <input type="text" name="description"  className="form-control" onChange={(e) => this.changeValue(e)} value={this.state.description} required/>
                                    </div>
                                </Col>
                            </Row>
                            
                            <div className="mt-3">      
                            <button type="button" className="mr-2 btn btn-primary"  onClick={this.handleUpdate.bind(this)}>Update</button>{' '}
                            <button type="button" className="btn btn-danger"  onClick={this.handleClear.bind(this)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(UpdateCategory);