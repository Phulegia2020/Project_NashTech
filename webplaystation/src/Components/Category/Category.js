import React, {Component} from 'react';
import "./Category.css";
import {del, get, post, put} from "./../../Utils/httpHelper";
import { Link } from 'react-router-dom';
import Add from "./Add"
import Update from './UpdateCategory';

export default class Category extends Component {
    state = {
        categories: [],
        isDisplayForm: false,
        // isDisplayFormUpdate: false,
        // updatedCate: null
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
                // alert(`${id} is found`);
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

    // updateCategory(data)
    // {
    //     put(`/categories/${data.id}`, {name: data.name, description: data.description})
    //     .then((response) => {
    //         if (response.status === 200)
    //         {
    //             console.log(response.data);
    //             this.state.categories.forEach((cate, index) => {
    //                 if (cate.id === data.id)
    //                 {
    //                     var {cates} = this.state.categories;
    //                     cates[index] = data;
    //                     this.setState({
    //                         categories: cates
    //                     })
    //                 }
    //             })
    //         }
    //     })
    // }

    onAdd = (data) => {
        console.log(data);
        this.createCategory(data);
    }

    onToggleForm = () => {
        this.setState({
            isDisplayForm: !this.state.isDisplayForm
        });
    }

    // onToggleFormUpdate = (id) => {
    //     this.state.categories.forEach((cate) => {
    //         if (cate.id === id)
    //         {
    //             this.setState({
    //                 updateCategory: cate
    //             })
    //         }
    //     })
    //     this.setState({
    //         isDisplayFormUpdate: !this.state.isDisplayFormUpdate,
    //     });
    // }

    onCloseForm = () => {
        this.setState({
            isDisplayForm: false,
            // isDisplayFormUpdate: false
        });
    }

    // onUpdate = (data) => {
    //     console.log(data);
    //     this.updateCategory(data);
    // }

    render() {
        return (
            <div>
                <button type="button" className="btn btn-primary" onClick={this.onToggleForm}>
                    <span className="fa fa-plus mr-5"></span>
                    Creat New Category
                </button>
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
                                        {/* <Link to={`category/update/${cate.id}`}>
                                            <button className="btn btn-success" >
                                                <Update element={cate} onUpdate={this.onUpdate} 
                                                        onCloseForm={this.onCloseForm}/>
                                                Update
                                            </button>
                                        </Link> */}
                                        
                                        {/* <button className="btn btn-success" onClick={this.onToggleFormUpdate(cate.id)} >
                                            Update
                                        </button> */}

                                        <Link to={`category/update/${cate.id}`}>
                                            <button className="btn btn-success">
                                                Update
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                <div className="container">
                    {this.state.isDisplayForm ? <Add onAdd={this.onAdd} onCloseForm={this.onCloseForm}/> : ''}
                </div>
                
                {/* <div className="container">
                    {this.state.isDisplayFormUpdate ? <Update element={this.state.updatedCate} onUpdate={this.onUpdate} 
                                            onCloseForm={this.onCloseForm}/> : ''}
                </div> */}
                
            </div>
        )
    }
}
