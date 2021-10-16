import React, { Component } from 'react'
// import "./../Category/Category.css";
import { get } from "./../../Utils/httpHelper";
import {formatQuantity, formatCurrency} from "./../../Utils/Utils";
import { Statistic } from 'semantic-ui-react'
import "./Statistical.css";
import { Input } from 'reactstrap';
import {Rating} from 'semantic-ui-react'


class Statistical extends Component {
    constructor (props){
        super(props);
        this.state = {
            products: [],
            isDisplayForm: false,
            pageNumber: 0,
            pageToTal: 0,
            income: 0,
            bills: [],
            imports: [],
            outcome: 0,
            month: ['', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
            monthValue: new Date().getMonth() + 1,
            quy: ['', '1', '2', '3', '4'],
            quyValue: '',
            year: ['2021'],
            yearValue: new Date().getFullYear(),
        }
        
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

        // get(`/bills/income`)
        // .then((response) => {
        //     this.setState({
        //         income: response.data,
        //     });
        // })
        // .catch(error => console.log(error));

        // get(`/bills/done`)
        // .then((response) => {
        //     this.setState({
        //         bills: response.data,
        //     });
        // })
        // .catch(error => console.log(error));

        // await get(`/imports/done`)
        // .then((response) => {
        //     this.setState({
        //         imports: response.data,
        //     });
        // })
        // .catch(error => console.log(error));

        // for (let i = 0; i < this.state.imports.length; i++)
        // {
        //     this.setState({
        //         outcome: this.state.outcome + this.state.imports[i].total
        //     })
        // }

        get(`/bills/profit?month=${parseInt(new Date().getMonth() + 1)}&quy=${this.state.quyValue}&year=${parseInt(new Date().getFullYear())}`)
        .then((response) => {
            if (response.status === 200)
            {
                var doanhthu = 0;
                this.setState({
                    bills: response.data,
                }, () => console.log(response.data));
                for (var i = 0; i < response.data.length; i++)
                {
                    doanhthu = doanhthu + response.data[i].total
                    
                }
                this.setState({
                    income: doanhthu
                })
            }
        })
        .catch(error => {console.log(error)})

        get(`/imports/profit?month=${parseInt(new Date().getMonth() + 1)}&quy=${this.state.quyValue}&year=${parseInt(new Date().getFullYear())}`)
        .then((response) => {
            if (response.status === 200)
            {
                var doanhthu = 0;
                this.setState({
                    imports: response.data,
                }, () => console.log(response.data));
                for (var i = 0; i < response.data.length; i++)
                {
                    doanhthu = doanhthu + response.data[i].total
                    
                }
                this.setState({
                    outcome: doanhthu
                })
            }
        })
        .catch(error => {console.log(error)})
    }

    componentDidUpdate(prevProps, prevState){
        if (prevState.monthValue !== this.state.monthValue || prevState.quyValue !== this.state.quyValue || prevState.yearValue !== this.state.yearValue) 
        {
            if (this.state.monthValue === '')
            {
                this.setState({
                    monthValue: '0'
                })
            }
            get(`/bills/profit?month=${parseInt(this.state.monthValue)}&quy=${this.state.quyValue}&year=${this.state.yearValue}`)
            .then((response) => {
                if (response.status === 200)
                {
                    var doanhthu = 0;
                    this.setState({
                        bills: response.data,
                    }, () => console.log(response.data));
                    for (var i = 0; i < response.data.length; i++)
                    {
                        doanhthu = doanhthu + response.data[i].total
                        
                    }
                    this.setState({
                        income: doanhthu
                    })
                }
            })
            .catch(error => {console.log(error)})
            get(`/imports/profit?month=${parseInt(this.state.monthValue)}&quy=${this.state.quyValue}&year=${parseInt(new Date().getFullYear())}`)
            .then((response) => {
                if (response.status === 200)
                {
                    var doanhthu = 0;
                    this.setState({
                        imports: response.data,
                    }, () => console.log(response.data));
                    for (var i = 0; i < response.data.length; i++)
                    {
                        doanhthu = doanhthu + response.data[i].total
                        
                    }
                    this.setState({
                        outcome: doanhthu
                    })
                }
            })
            .catch(error => {console.log(error)})
        }
    }

    changeValue(e){
        if (e.target.value === '')
        {
            this.setState({
                [e.target.name]: '0'
            })
        }
        else
        {
            this.setState({
                [e.target.name]: e.target.value
            }, () => console.log(e.target.value))
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
                <div className='thang-quy-nam'>
                    <h4>Chọn Tháng:</h4>
                    <Input type="select" name="monthValue" id="month" value={this.state.monthValue} onChange={(e) => this.changeValue(e)} style={{width: '150px', marginRight:'20px'}}>
                        {
                            this.state.month.map((m, index) => (
                                <option key={index} value={this.state.month[index]}>{this.state.month[index]}</option>
                            ))
                        }
                    </Input>

                    <h4>Chọn Quý:</h4>
                    <Input type="select" name="quyValue" id="quy" value={this.state.quyValue} onChange={(e) => this.changeValue(e)} style={{width: '150px', marginRight:'20px'}}>
                        {
                            this.state.quy.map((q, index) => (
                                <option key={index} value={this.state.quy[index]}>{this.state.quy[index]}</option>
                            ))
                        }
                    </Input>

                    <h4>Chọn Năm:</h4>
                    <Input type="select" name="yearValue" id="year" value={this.state.yearValue} onChange={(e) => this.changeValue(e)} style={{width: '150px'}}>
                        {
                            this.state.year.map((y, index) => (
                                <option key={index} value={this.state.year[index]}>{this.state.year[index]}</option>
                            ))
                        }
                    </Input>
                </div>
                <div className="bao-cao">
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
                    <div className="rp">
                        <Statistic.Group size='small' id="doanhthu">
                            {/* <Statistic>
                                <Statistic.Value>{formatQuantity(this.state.bills.length)}</Statistic.Value>
                                <Statistic.Label>BILLS DONE</Statistic.Label>
                            </Statistic> */}
                            <Statistic>
                                <Statistic.Value>{formatCurrency(this.state.income - this.state.outcome)}</Statistic.Value>
                                <Statistic.Label>LỢI NHUẬN</Statistic.Label>
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
                <div className='top-best-sale'>
                    <h2>TOP 5 BEST RATING POINT PRODUCTS</h2>
                    <table id="table-tk">
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
                                        <td><Rating icon='star' maxRating={5} rating={p.totalrating} disabled/> ({p.totalrating})</td>
                                    </tr>
                                ))
                            }
                            {/* <tr id="tr-tk">
                                        <td>a</td>
                                        <td>
                                            b
                                        </td>
                                        <td>c</td>
                                        <td>d</td>
                                        <td>e</td>
                                    </tr>
                                    <tr>
                                        <td>a</td>
                                        <td>
                                            b
                                        </td>
                                        <td>c</td>
                                        <td>d</td>
                                        <td>e</td>
                                    </tr> */}
                        </tbody>
                    </table>
                </div>
                
            </div>
        )
    }
}

export default Statistical;