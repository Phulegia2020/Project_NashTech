import React, { Component } from 'react'
import { Col, Row, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { get } from '../../Utils/httpHelper';

export default class Add extends Component {

    constructor(props)
    {
        super(props);
        this.state = {
            name: "",
            description: "",
            Error: "",
            key: "",
            categories: [],
        }
    }
    
    componentDidMount(){
        get("/categories")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({categories: response.data});
            }
        })
        .catch(error => {console.log(error)})
    }

    changeName(e){
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    changeDescription(e){
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleCreate(event){
        event.preventDefault();

        for (let i = 0; i < this.state.categories.length; i++)
        {
            if (this.state.categories[i].name === event.target.name.value.trim())
            {
                this.setState({
                    key: 'name'
                })
                this.setState({
                    Error: "This name is existed!"
                });
                return;
            }
        }

        this.props.onAdd(this.state);

        // if (this.state.name === "")
        // {
        //     alert("Empty Name");
        // }
        // else if (this.state.description === "")
        // {
        //     alert("Empty Description");
        // }
        // else
        // {
        //     this.props.onAdd(this.state);
        // }
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
                <Form onSubmit={(event) => this.handleCreate(event)}>
                {/* <h3>Create New Product</h3> */}
                    <FormGroup>
                        <Label for="name">Name</Label>
                        <Input type="text" name="name" id="name" placeholder="PS5" onChange={(e) => this.changeName(e)} value = {this.state.name} required="required"/>
                        {this.state.key === 'name' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                    </FormGroup>
                    <FormGroup>
                        <Label for="description">Description</Label>
                        <Input type="text" name="description" id="description" placeholder="PlayStation 5 Pro" onChange={(e) => this.changeDescription(e)} value = {this.state.description} required="required"/>
                    </FormGroup>
                    
                    <div className="mt-3">
                        <Button type="submit" outline color="warning" >Add</Button>{' '}
                        <Button outline color="danger" onClick={this.handleClear.bind(this)}>Cancel</Button>
                    </div>
                </Form>
                {/* <form>
                <div className="container">
                    <div className="row">
                    <h3>Create new category</h3>
                        <div className="col-md-12">
                            <Row form>
                                <Col>
                                    <div className="form-group">
                                        <label>Name</label>
                                        <input type="text" name="name" className="form-control" onChange={(e) => this.changeName(e)} value = {this.state.name} required="required"/>
                                    </div>
                                </Col>
                            </Row>
                            <Row form>
                                <Col>
                                    <div className="form-group">
                                        <label>Description</label>
                                        <input type="text" name="description"  className="form-control" onChange={(e) => this.changeDescription(e)} value={this.state.description} required="required"/>
                                    </div>
                                </Col>
                            </Row>
                            
                            <div className="mt-3">      
                            <button type="button" className="mr-2 btn btn-primary"  onClick={this.handleCreate.bind(this)}>
                                Add
                            </button>{' '}
                            <button type="submit" className="btn btn-danger"  onClick={this.handleClear.bind(this)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
                </form> */}
            </div>
        )
    }
}
