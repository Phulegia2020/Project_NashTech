import React, {Component} from 'react';
import "./Category.css";
import {del, get, post, put} from "./../../Utils/httpHelper";
import { Link } from 'react-router-dom';
import Add from "./Add"

export default class Category extends Component {
    state = {
        categories: []
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

    find(id){
        get(`/categories/${id}`)
        .then((response) => {
            if (response.status === 200)
            {
                console.log(response.data);
                alert(`${id} is found`);
            }
        })
    }

    delCategory(id)
    {
        del(`/categories/${id}`)
        .then((response) => {
            console.log(response.data);
            this.setState({categories: this.state.categories.filter(cate => cate.id !== id)})
        })
        .catch(error => {console.log(error)})
    }

    createCategory(newCategory){
        post(`/categories`, {name: newCategory.name, description: newCategory.description})
        .then((response) => {
            console.log(response.data);
            this.setState({
                categories: [...this.state.categories, response.data],
            });
        });
    }

    updateCategory(id)
    {
        put(`/categories/${id}`)
        .then((response) => {
            if (response.status === 200)
            {
                console.log(response.data);
                
            }
        })
    }

    onAdd = (data) => {
        console.log(data);
        this.createCategory(data);
    }

    render() {
        return (
            <div>
                <table id="table">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.categories.map((cate) => (
                                <tr key={cate.id} onClick={() => this.find(cate.id)}>
                                    <td>{cate.id}</td>
                                    <td>{cate.name}</td>
                                    <td>{cate.description}</td>
                                    <td><button onClick={() => this.delCategory(cate.id)}>Del</button></td>
                                    <td>
                                        <Link to={`category/update/${cate.id}`}>
                                            <button className="btn btn-success">Update</button>
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                <Add onAdd={this.onAdd}/>
                
            </div>
        )
    }
}
