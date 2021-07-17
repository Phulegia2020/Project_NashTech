import React, { Component } from 'react'

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
        this.setState({description: e.target.value})
    }

    handleCreate(event){
        // const newCategory = {
        //     name: this.state.name,
        //     description: this.state.description
        // };
        // this.props.onAdd(newCategory);
        event.preventDefault();
        //console.log(this.state);
        this.props.onAdd(this.state);
    }

    handleClear = () => {
        this.setState({
            name: '',
            description: ''
        });
        // console.log(this.state);
    }

    render() {
        return (
            <div>
                <div className="container">
                    <div className="row">
                        <div className="col-md-4">
                            <h1>{this.state.action}</h1>
                            <div className="form-group">
                                <label>Name</label>
                                <input type="text" name="name" className="form-control" onChange={(e) => this.changeName(e)} value = {this.state.name}/>
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <input type="text" name="description"  className="form-control" onChange={(e) => this.changeDescription(e)} value={this.state.description}/>
                            </div>
                            <div className="form-group">      
                            <button type="button" className="btn btn-primary"  onClick={this.handleCreate.bind(this)}>Add</button>
                            <button type="button" className="btn btn-danger"  onClick={this.handleClear.bind(this)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
