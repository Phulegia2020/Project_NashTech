import React, { Component } from 'react'
import { withRouter } from "react-router";
import { put, get } from '../../Utils/httpHelper';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import "./Category.css";

class UpdateCategory extends React.Component {

    state = {
        id: this.props.match.params.id,
        name: "",
        description: "",
        status: "",
        Error: "",
        key: "",
        categories: [],
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

        get(`/categories/${this.state.id}`)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    name: response.data.name,
                    description: response.data.description,
                    status: response.data.status
                })
            }
        })
    }

    changeValue(e){
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleUpdate(event){
        event.preventDefault();

        for (let i = 0; i < this.state.categories.length; i++)
        {
            if (this.state.categories[i].id != this.state.id)
            {
                if (this.state.categories[i].name === event.target.name.value.trim())
                {
                    this.setState({
                        key: 'name'
                    })
                    this.setState({
                        Error: "Tên Loại này đã được sử dụng!"
                    });
                    return;
                }
            }
        }
        put(`/categories/${this.state.id}`, {name: this.state.name.trim(), description: this.state.description.trim(), status: this.state.status})
        .then((response) => {
            if (response.status === 200)
            {
                this.props.history.push("/admin/category");
            }
        })
    }

    handleClear = () => {
        this.setState({
            name: '',
            description: ''
        });
        this.props.history.push("/admin/category");
    }

    componentWillUnmount() {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }

    render() {
        return (
            <div className="update-form">
                <h3>Cập Nhật Loại Máy</h3>
                <Form onSubmit={(event) => this.handleUpdate(event)}>
                    <FormGroup>
                        <Label htmlFor="name">Tên</Label>
                        <Input type="text" name="name" id="name" placeholder="PS5" onChange={(e) => this.changeValue(e)} value = {this.state.name} required="required"/>
                        {this.state.key === 'name' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="description">Mô Tả</Label>
                        <Input type="text" name="description" id="description" placeholder="PlayStation 5" onChange={(e) => this.changeValue(e)} value = {this.state.description} required="required"/>
                    </FormGroup>
                    
                    <div className="mt-3">
                        <Button type="submit" outline color="warning" >Cập Nhật</Button>{' '}
                        <Button outline color="danger" onClick={this.handleClear.bind(this)}>Hủy</Button>
                    </div>
                </Form>
            </div>
        )
    }
}

export default withRouter(UpdateCategory);