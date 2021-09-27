import React, { Component } from 'react'
import "./../Category/Category.css";
import { get } from "./../../Utils/httpHelper";
import {formatQuantity, formatCurrency} from "./../../Utils/Utils";
import { Statistic } from 'semantic-ui-react'
import "./Statistical.css";


class Statistical extends Component {
    state = {
        products: [],
        isDisplayForm: false,
        pageNumber: 0,
        pageToTal: 0,
        income: 0,
        bills: [],
        imports: [],
        outcome: 0
    }

    async componentDidMount(){
        get("/products/totalrating")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    products: response.data,
                });
            }
        })
        .catch(error => {console.log(error)})

        get(`/bills/income`)
        .then((response) => {
            this.setState({
                income: response.data,
            });
        })
        .catch(error => console.log(error));

        get(`/bills/done`)
        .then((response) => {
            this.setState({
                bills: response.data,
            });
        })
        .catch(error => console.log(error));

        await get(`/imports/done`)
        .then((response) => {
            this.setState({
                imports: response.data,
            });
        })
        .catch(error => console.log(error));

        for (let i = 0; i < this.state.imports.length; i++)
        {
            this.setState({
                outcome: this.state.outcome + this.state.imports[i].total
            })
        }
    }

    componentWillUnmount() {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }

    render() {
        return (
            <div>
                <h2 style={{textAlign: 'center'}}>TOP 5 BEST RATING POINT PRODUCTS</h2>
                <table id="table">
                    <thead>
                        <tr>
                            <th><b>ID</b></th>
                            <th><b>Product</b></th>
                            <th><b>Name</b></th>
                            <th><b>Price</b></th>
                            <th><b>Rated Point (Star)</b></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.products.map((p) => (
                                <tr key={p.id}>
                                    <td>{p.id}</td>
                                    <td>
                                        <img src={`data:image/jpeg;base64,${p.imageurl}`} alt="" height="75px"></img>
                                    </td>
                                    <td>{p.name}</td>
                                    <td>{formatCurrency(p.price)}</td>
                                    <td>{p.totalrating}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>

                <div >
                    <div className="rp">
                        <Statistic.Group size='small' id="income">
                            <Statistic>
                                <Statistic.Value>{formatQuantity(this.state.bills.length)}</Statistic.Value>
                                <Statistic.Label>BILLS DONE</Statistic.Label>
                            </Statistic>
                            <Statistic>
                                <Statistic.Value>{formatCurrency(this.state.income)}</Statistic.Value>
                                <Statistic.Label>TOTAL INCOME</Statistic.Label>
                            </Statistic>
                        </Statistic.Group>
                        {/* <h3>BILLS DONE: {formatQuantity(this.state.bills.length)}</h3>
                        <h3>TOTAL INCOME: {formatCurrency(this.state.income)}</h3> */}
                    </div>
                    <div className="rp" id="outcome">
                        <Statistic.Group size='small'>
                            <Statistic>
                                <Statistic.Value>{formatQuantity(this.state.imports.length)}</Statistic.Value>
                                <Statistic.Label>IMPORTS DONE</Statistic.Label>
                            </Statistic>
                            <Statistic>
                                <Statistic.Value>{formatCurrency(this.state.outcome)}</Statistic.Value>
                                <Statistic.Label>TOTAL OUTCOME</Statistic.Label>
                            </Statistic>
                        </Statistic.Group>
                        {/* <h3>IMPORTS DONE: {formatQuantity(this.state.imports.length)}</h3>
                        <h3>TOTAL OUTCOME: {formatCurrency(this.state.outcome)}</h3> */}
                    </div>
                </div>
            </div>
        )
    }
}

export default Statistical;