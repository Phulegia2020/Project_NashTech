import React, { Component } from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import {get} from "../../Utils/httpHelper";
import { Input } from 'reactstrap';
import "./Statistical.css";

export default class Chart extends Component {
    constructor (props){
        super(props);

        this.state = {
            data: [],
            COLORS: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF2C4F'],
            month: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
            monthValue: new Date().getMonth() + 1
        }
    }

    componentDidMount(){
        get(`/products/topSale?month=${parseInt(this.state.monthValue)}`)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    data: response.data.slice(0, 5),
                }, () => console.log(this.state.data));
            }
        })
        .catch(error => {console.log(error)})
    }

    componentDidUpdate(prevProps, prevState){
        if (prevState.monthValue !== this.state.monthValue)
        {
            get(`/products/topSale?month=${parseInt(this.state.monthValue)}`)
            .then((response) => {
                if (response.status === 200)
                {
                    this.setState({
                        data: response.data.slice(0, 5),
                    }, () => console.log(this.state.data));
                }
            })
            .catch(error => {console.log(error)})
        }
    }

    changeValue(e){
        this.setState({
            monthValue: e.target.value
        }, () => console.log(this.state.monthValue))
    }

    render() {
        return (
            <div>
                <h4>Choose month:</h4>
                <Input type="select" name="month" id="month" value={this.state.monthValue} onChange={(e) => this.changeValue(e)} style={{width: '150px'}}>
                    {
                        this.state.month.map((m, index) => (
                            <option key={index} value={this.state.month[index]}>{this.state.month[index]}</option>
                        ))
                    }
                </Input>
                <h4 style={{textAlign: 'center'}}>TOP 5 BEST SALE PRODUCTS IN {this.state.monthValue}/{new Date().getFullYear()}</h4>
                <PieChart width={1000} height={400} onMouseEnter={this.onPieEnter}>
                    <Pie
                    data={this.state.data}
                    cx={800}
                    cy={160}
                    innerRadius={90}
                    outerRadius={150}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="topSale"
                    >
                    {this.state.data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={this.state.COLORS[index % this.state.COLORS.length]} />
                    ))}
                    </Pie>
                </PieChart>
                <div className="txtexplain">
                    {this.state.data.map((d, index) => (
                        <div key={index} className="explain-note">
                            <div className="explain-color" style={{backgroundColor: this.state.COLORS[index % this.state.COLORS.length]}}>
                            </div>
                            {d.product}
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}
