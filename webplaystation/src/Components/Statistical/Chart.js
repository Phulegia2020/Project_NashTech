import React, { Component } from 'react';
import { PieChart, Pie, Cell, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import {get} from "../../Utils/httpHelper";
import { Input } from 'reactstrap';
import "./Statistical.css";
import {formatQuantity, formatCurrency} from "./../../Utils/Utils";
import ReactExport from "react-data-export";
import { Statistic } from 'semantic-ui-react';

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

// const ReactExport = require("react-data-export");
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ExcelFile.ExcelSheet;

export default class Chart extends Component {
    constructor (props){
        super(props);

        this.state = {
            revenue: [],
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
            dateFrom: this.convertToday(),
            dateTo: this.convertToday(),
        }
    }

    componentDidMount(){
        // get(`/bills/profit?month=${parseInt(new Date().getMonth() + 1)}&quy=${this.state.quyValue}&year=${parseInt(new Date().getFullYear())}`)
        // .then((response) => {
        //     if (response.status === 200)
        //     {
        //         var doanhthu = 0;
        //         this.setState({
        //             bills: response.data,
        //         }, () => console.log(response.data));
        //         for (var i = 0; i < response.data.length; i++)
        //         {
        //             doanhthu = doanhthu + response.data[i].total
                    
        //         }
        //         this.setState({
        //             income: doanhthu
        //         })
        //     }
        // })
        // .catch(error => {console.log(error)})

        // get(`/imports/profit?month=${parseInt(new Date().getMonth() + 1)}&quy=${this.state.quyValue}&year=${parseInt(new Date().getFullYear())}`)
        // .then((response) => {
        //     if (response.status === 200)
        //     {
        //         var doanhthu = 0;
        //         this.setState({
        //             imports: response.data,
        //         }, () => console.log(response.data));
        //         for (var i = 0; i < response.data.length; i++)
        //         {
        //             doanhthu = doanhthu + response.data[i].total
                    
        //         }
        //         this.setState({
        //             outcome: doanhthu
        //         })
        //     }
        // })
        // .catch(error => {console.log(error)})

        get(`/bills/profitDate?dateFrom=${this.state.dateFrom}&dateTo=${this.state.dateTo}`)
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

        get(`/imports/profitDate?dateFrom=${this.state.dateFrom}&dateTo=${this.state.dateTo}`)
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
        // if (prevState.monthValue !== this.state.monthValue || prevState.quyValue !== this.state.quyValue || prevState.yearValue !== this.state.yearValue) 
        // {
        //     if (this.state.monthValue === '')
        //     {
        //         this.setState({
        //             monthValue: '0'
        //         })
        //     }
        //     get(`/bills/profit?month=${parseInt(this.state.monthValue)}&quy=${this.state.quyValue}&year=${this.state.yearValue}`)
        //     .then((response) => {
        //         if (response.status === 200)
        //         {
        //             var doanhthu = 0;
        //             this.setState({
        //                 bills: response.data,
        //             }, () => console.log(response.data));
        //             for (var i = 0; i < response.data.length; i++)
        //             {
        //                 doanhthu = doanhthu + response.data[i].total
                        
        //             }
        //             this.setState({
        //                 income: doanhthu
        //             })
        //         }
        //     })
        //     .catch(error => {console.log(error)})
        //     get(`/imports/profit?month=${parseInt(this.state.monthValue)}&quy=${this.state.quyValue}&year=${this.state.yearValue}`)
        //     // parseInt(new Date().getFullYear())
        //     .then((response) => {
        //         if (response.status === 200)
        //         {
        //             var doanhthu = 0;
        //             this.setState({
        //                 imports: response.data,
        //             }, () => console.log(response.data));
        //             for (var i = 0; i < response.data.length; i++)
        //             {
        //                 doanhthu = doanhthu + response.data[i].total
                        
        //             }
        //             this.setState({
        //                 outcome: doanhthu
        //             })
        //         }
        //     })
        //     .catch(error => {console.log(error)})
        // }
        if (prevState.dateFrom !== this.state.dateFrom || prevState.dateTo !== this.state.dateTo)
        {
            get(`/bills/profitDate?dateFrom=${this.state.dateFrom}&dateTo=${this.state.dateTo}`)
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

            get(`/imports/profitDate?dateFrom=${this.state.dateFrom}&dateTo=${this.state.dateTo}`)
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

    convertToday() {
        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth() + 1; //January is 0!
        let yyyy = today.getFullYear();
        if (dd < 10) {
          dd = "0" + dd;
        }
        if (mm < 10) {
          mm = "0" + mm;
        }
      
        today = yyyy + "-" + mm + "-" + dd;
        return today;
      }

    componentWillUnmount() {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
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
                <h3 className="title-report">THỐNG KÊ BÁO CÁO DOANH THU</h3>
                <div className='thang-quy-nam'>
                    {/* <h4>THÁNG:</h4>
                    <Input type="select" name="monthValue" id="month" value={this.state.monthValue} onChange={(e) => this.changeValue(e)} style={{width: '150px', marginRight:'20px'}}>
                        {
                            this.state.month.map((m, index) => (
                                <option key={index} value={this.state.month[index]}>{this.state.month[index]}</option>
                            ))
                        }
                    </Input>
                    <h4>QUÝ:</h4>
                    <Input type="select" name="quyValue" id="quy" value={this.state.quyValue} onChange={(e) => this.changeValue(e)} style={{width: '150px', marginRight:'20px'}}>
                        {
                            this.state.quy.map((q, index) => (
                                <option key={index} value={this.state.quy[index]}>{this.state.quy[index]}</option>
                            ))
                        }
                    </Input>

                    <h4>NĂM:</h4>
                    <Input type="select" name="yearValue" id="year" value={this.state.yearValue} onChange={(e) => this.changeValue(e)} style={{width: '150px'}}>
                        {
                            this.state.year.map((y, index) => (
                                <option key={index} value={this.state.year[index]}>{this.state.year[index]}</option>
                            ))
                        }
                    </Input> */}
                    
                    <h4>TỪ: </h4>
                    <input type="date" name="dateFrom" onChange={(e) => this.changeValue(e)} defaultValue={this.state.dateFrom} className="input-from"></input>
                    
                    
                    <h4>ĐẾN: </h4>
                    <input type="date" name="dateTo" onChange={(e) => this.changeValue(e)} defaultValue={this.state.dateTo}></input>
                    
                </div>
                <div className="bao-cao">
                    <div className="rp">
                        <Statistic.Group size='small' id="income">
                            <Statistic>
                                <Statistic.Value>{formatQuantity(this.state.bills.length)}</Statistic.Value>
                                <Statistic.Label>SỐ HÓA ĐƠN</Statistic.Label>
                            </Statistic>
                            <Statistic>
                                <Statistic.Value>{formatCurrency(this.state.income)}</Statistic.Value>
                                <Statistic.Label>TỔNG DOANH THU</Statistic.Label>
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
                                <Statistic.Label>PHIẾU ĐẶT HÀNG</Statistic.Label>
                            </Statistic>
                            <Statistic>
                                <Statistic.Value>{formatCurrency(this.state.outcome)}</Statistic.Value>
                                <Statistic.Label>TỔNG CHI PHÍ</Statistic.Label>
                            </Statistic>
                        </Statistic.Group>
                        {/* <h3>IMPORTS DONE: {formatQuantity(this.state.imports.length)}</h3>
                        <h3>TOTAL OUTCOME: {formatCurrency(this.state.outcome)}</h3> */}
                    </div>
                </div>

                <div className="line-chart">
                    <h4>DOANH THU THEO TỪNG THÁNG TRONG NĂM {new Date().getFullYear()}</h4>
                    <LineChart width={900} height={550} data={this.state.revenue} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
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
