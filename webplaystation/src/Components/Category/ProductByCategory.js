import React, { Component } from 'react'
import { get } from '../../Utils/httpHelper'
import { withRouter } from "react-router";
import { Link } from 'react-router-dom';

class ProductByCategory extends Component {
    state = {
        id: this.props.match.params.id,
        products: []
    }

    componentDidMount(){
        get(`/products/search?categoryId=${this.state.id}`)
        .then((response) => {
            if (response.status === 200)
            {
                console.log(response.data);
                this.setState({
                    products: response.data
                });
            }
        })
        console.log(this.state.id);
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
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Image</th>
                            <th>Category</th>
                            <th>Supplier</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.products.map((p) => (
                                <tr key={p.id}>
                                    <td>{p.id}</td>
                                    <td>{p.name}</td>
                                    <td>{p.description}</td>
                                    <td>{p.quantity}</td>
                                    <td>{p.price}</td>
                                    <td>{p.imageurl}</td>
                                    <td>{p.category_id}</td>
                                    <td>{p.supplier_id}</td>
                                    <td><button onClick={() => this.delProduct(p.id)}>Del</button></td>
                                    <td>
                                        <Link to={`product/update/${p.id}`}>
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
            </div>
        )
    }
}

export default withRouter(ProductByCategory);