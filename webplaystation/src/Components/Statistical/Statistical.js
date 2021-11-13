import React, { Component } from 'react'
// import "./../Category/Category.css";
import { get } from "./../../Utils/httpHelper";
import {formatQuantity, formatCurrency} from "./../../Utils/Utils";
import { Statistic } from 'semantic-ui-react'
import "./Statistical.css";
import { Input } from 'reactstrap';
import {Rating} from 'semantic-ui-react';
import { PieChart, Pie, Cell, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

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

class Statistical extends Component {
    constructor (props){
        super(props);
        this.state = {
            products: [],
            isDisplayForm: false,
            pageNumber: 0,
            pageToTal: 0,
            data: [],
            COLORS: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF2C4F'],
            month: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
            monthValue: new Date().getMonth() + 1,
        }
        
    }

    componentDidMount(){
        get("/products/totalrating")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    products: response.data.slice(0, 5),
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

    componentWillUnmount() {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }

    render() {
        return (
            <div className="charts">
                <div className="pie-chart">
                    <div className="choosen">
                        <h4>THÁNG:</h4>
                        <Input type="select" name="month" id="month" value={this.state.monthValue} onChange={(e) => this.changeValue(e)} style={{width: '150px'}}>
                            {
                                this.state.month.map((m, index) => (
                                    <option key={index} value={this.state.month[index]}>{this.state.month[index]}</option>
                                ))
                            }
                        </Input>
                    </div>
                    <h4 style={{textAlign: 'center', marginTop: '10px'}}>TOP 5 MÁY BÁN CHẠY NHẤT TRONG {this.state.monthValue}/{new Date().getFullYear()}</h4>
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
                    <p className="note-chart">Chú thích:</p>
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
                <div className='top-best-sale'>
                    <h2>TOP 5 MÁY CÓ ĐIỂM ĐÁNH GIÁ CAO NHẤT</h2>
                    <table id="table-tk">
                        <thead>
                            <tr>
                                <th><b>Mã ID</b></th>
                                <th><b>Hình Ảnh</b></th>
                                <th><b>Tên</b></th>
                                <th><b>Giá</b></th>
                                <th><b>Điểm Đánh Giá</b></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.products.map((p) => (
                                    <tr key={p.id}>
                                        <td>{p.id}</td>
                                        <td>
                                            {/* <img src={`data:image/jpeg;base64,${p.imageurl}`} alt="" height="75px"></img> */}
                                            <img src={p.url_image || "http://via.placeholder.com/300"} alt="" height="75px"/>
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