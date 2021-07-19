import React, { Component } from 'react'
import { Row, Col } from 'reactstrap';

export default class Add extends Component {

    constructor(props)
    {
        super(props);
        this.state = {
            name: "",
            description: ""
        }
    }
    


    changeName(e){
        //this.setState({name: e.target.value})
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    changeDescription(e){
        //this.setState({description: e.target.value})
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleCreate(event){
        // const newCategory = {
        //     name: this.state.name,
        //     description: this.state.description
        // };
        // this.props.onAdd(newCategory);
        event.preventDefault();
        if (this.state.name === "")
        {
            alert("Empty");
        }
        else if (this.state.description === "")
        {
            alert("Empty");
        }
        else
        {
            this.props.onAdd(this.state);
        }
        //console.log(this.state);
    }

    handleClear = () => {
        this.setState({
            name: '',
            description: ''
        });
        this.props.onCloseForm();
        // console.log(this.state);
    }

    render() {
        return (
            <div>
                <form>
                <div className="container">
                    <div className="row">
                        <div className="col-md-4">
                            <h1>Create new category</h1>
                            <Row form>
                                <Col md={6}>
                                    <div className="form-group">
                                        <label>Name</label>
                                        <input type="text" name="name" className="form-control" onChange={(e) => this.changeName(e)} value = {this.state.name} required="required"/>
                                    </div>
                                </Col>
                            </Row>
                            <Row form>
                                <Col md={6}>
                                    <div className="form-group">
                                        <label>Description</label>
                                        <input type="text" name="description"  className="form-control" onChange={(e) => this.changeDescription(e)} value={this.state.description} required="required"/>
                                    </div>
                                </Col>
                            </Row>
                            
                            <div className="form-group">      
                            <button type="button" className="mr-2 btn btn-primary"  onClick={this.handleCreate.bind(this)}>
                                <span className="fa fa-plus mr-5">Add</span>
                            </button>
                            <button type="submit" className="btn btn-danger"  onClick={this.handleClear.bind(this)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
                </form>
            </div>
        )
    }
}
