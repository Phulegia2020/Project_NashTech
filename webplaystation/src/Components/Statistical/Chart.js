import React, { Component } from 'react';
import { PieChart, Pie, Cell, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import {get} from "../../Utils/httpHelper";
import { Input } from 'reactstrap';
import "./Statistical.css";
import {formatQuantity} from "./../../Utils/Utils";
import ReactExport from "react-data-export";

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
            <p className="label">{`Tháng ${label} : ${formatQuantity(payload[0].value * 1000000)} VNĐ`}</p>
          {/* {payload[0].value > 0 && <p className="label">{`Tháng ${label} : ${payload[0].value}.000.000 VNĐ`}</p>}
          {payload[0].value <= 0 && <p className="label">{`Tháng ${label} : ${payload[0].value * 1000000} VNĐ`}</p>} */}
          {/* <p className="intro">{getIntroOfPage(label)}</p> */}
          <p className="desc">Doanh Thu Theo Tháng</p>
        </div>
      );
    }
    return null;
};

const CustomizedLabel = ({ active, payload, label }) => {
    // const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    // const x = cx + radius * Math.cos(-midAngle * RADIAN);
    // const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    // return (
    //   <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
    //     {`${(percent * 100).toFixed(0)}%`}
    //   </text>
    // );
    if (active && payload && payload.length) {
        return (
          <div className="custom-tooltip">
            <p className="label">{`${payload[0].value} máy`}</p>
            <p className="desc">Số lượng máy đã bán</p>
          </div>
        );
      }
      return null;
};

// const ReactExport = require("react-data-export");
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ExcelFile.ExcelSheet;

export default class Chart extends Component {
    constructor (props){
        super(props);

        this.state = {
            data: [],
            COLORS: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF2C4F'],
            month: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
            monthValue: new Date().getMonth() + 1,
            revenue: [],
            
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

        get('/bills/revenue')
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    revenue: response.data
                })
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
        const dataSet = [
            {
                columns: [
                  {title: "Tháng", style: {alignment:{horizontal: 'center'}, font: {bold: true}}},
                  {title: "Doanh Thu (VNĐ)", width: {wpx: 150}, style: {alignment:{horizontal: 'center'}, font: {bold: true}}},
                  {title: "Chi Phí (VNĐ)", width: {wpx: 150}, style: {alignment:{horizontal: 'center'}, font: {bold: true}}},
                  {title: "Lợi Nhuận (VNĐ)", width: {wpx: 150}, style: {alignment:{horizontal: 'center'}, font: {bold: true}}}
                ],
                data: this.state.revenue.map(rev => [
                  {value: rev.name, style: {alignment:{horizontal: 'center'}}},
                  {value: formatQuantity(rev.revenue*1000000), style: {alignment:{horizontal: 'center'}}},
                  {value: formatQuantity(rev.expense), style: {alignment:{horizontal: 'center'}}},
                  {value: formatQuantity(rev.profit), style: {alignment:{horizontal: 'center'}}}
                ])
            }
        ];
        return (
            <div className="charts">
                <div className="pie-chart">
                    <h4>THÁNG:</h4>
                    <Input type="select" name="month" id="month" value={this.state.monthValue} onChange={(e) => this.changeValue(e)} style={{width: '150px'}}>
                        {
                            this.state.month.map((m, index) => (
                                <option key={index} value={this.state.month[index]}>{this.state.month[index]}</option>
                            ))
                        }
                    </Input>
                    <h4 style={{textAlign: 'center'}}>TOP 5 MÁY BÁN CHẠY NHẤT TRONG {this.state.monthValue}/{new Date().getFullYear()}</h4>
                    <PieChart width={1000} height={400} onMouseEnter={this.onPieEnter}>
                        <Pie
                        data={this.state.data}
                        // cx={800}
                        // cy={160}
                        cx={370}
                        cy={170}
                        innerRadius={90}
                        outerRadius={150}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="topSale"
                        label
                        >
                        {this.state.data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={this.state.COLORS[index % this.state.COLORS.length]} />
                        ))}
                        </Pie>
                        <Tooltip content={<CustomizedLabel/>}/>
                    </PieChart>
                    <div className="txtexplain">
                        {this.state.data.map((d, index) => (
                            d.topSale > 0 &&
                            <div key={index} className="explain-note">
                                <div className="explain-color" style={{backgroundColor: this.state.COLORS[index % this.state.COLORS.length]}}>
                                </div>
                                {d.product}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="line-chart">
                
                <h4>DOANH THU THEO TỪNG THÁNG TRONG NĂM {new Date().getFullYear()}</h4>
                <LineChart width={600} height={550} data={this.state.revenue} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <Line type="monotone" dataKey="revenue" stroke="#82ca9d" />
                    {/* #8884d8   #e74c3c*/}
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip/>}/>
                </LineChart>
                <ExcelFile filename={`Report_Doanh_Thu_${new Date().getFullYear()}`} element={<button className="btn-exportReport">IN BÁO CÁO</button>}>
                    <ExcelSheet dataSet={dataSet} name="Report_Sheet"/>
                </ExcelFile>
                </div>
            </div>
        )
    }
}
