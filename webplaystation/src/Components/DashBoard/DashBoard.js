import React, {Component, Fragment} from 'react';
import classnames from 'classnames';
import { get } from '../../Utils/httpHelper';

import {
    Row, Col,
    Button,
    CardHeader,
    Card,
    CardBody,
    Progress,
    TabContent,
    TabPane,
} from 'reactstrap';

import {
    AreaChart, Area, Line,
    ResponsiveContainer,
    Bar,
    BarChart,
    ComposedChart,
    CartesianGrid,
    Tooltip,
    LineChart
} from 'recharts';

import {
    faAngleUp,
    faArrowUp,
    faArrowLeft,
    faAngleDown
} from '@fortawesome/free-solid-svg-icons';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import "./DashBoard.css";

const data = [
    {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
    {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
    {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
    {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
    {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
    {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
    {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
    {name: 'Page C', uv: 2000, pv: 6800, amt: 2290},
    {name: 'Page D', uv: 4780, pv: 7908, amt: 2000},
    {name: 'Page E', uv: 2890, pv: 9800, amt: 2181},
    {name: 'Page F', uv: 1390, pv: 3800, amt: 1500},
    {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
];

const data2 = [
    {name: 'Page A', uv: 5400, pv: 5240, amt: 1240},
    {name: 'Page B', uv: 7300, pv: 4139, amt: 3221},
    {name: 'Page C', uv: 8200, pv: 7980, amt: 5229},
    {name: 'Page D', uv: 6278, pv: 4390, amt: 3200},
    {name: 'Page E', uv: 3189, pv: 7480, amt: 6218},
    {name: 'Page D', uv: 9478, pv: 6790, amt: 2200},
    {name: 'Page E', uv: 1289, pv: 1980, amt: 7218},
    {name: 'Page F', uv: 3139, pv: 2380, amt: 5150},
    {name: 'Page G', uv: 5349, pv: 3430, amt: 3210},
];

export default class AnalyticsDashboard1 extends Component {
    constructor() {
        super();

        this.state = {
            dropdownOpen: false,
            activeTab1: '11',
            products: 0,
            totalProducts: 0,
            users: 0,
            totalUsers: 0,
            bills: 0,
            totalBills: 0,
            imports: 0,
            totalImports: 0
        };
        this.toggle = this.toggle.bind(this);
        this.toggle1 = this.toggle1.bind(this);

    }

    componentDidMount()
    {
        get("/products/onSale")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    products: response.data.length
                })
            }
        })
        .catch(error => {console.log(error)})

        get("/products")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    totalProducts: response.data.length
                })
            }
        })
        .catch(error => {console.log(error)})

        get("/users/active")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    users: response.data
                })
            }
        })
        .catch(error => {console.log(error)})

        get("/users")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    totalUsers: response.data.length
                })
            }
        })
        .catch(error => {console.log(error)})

        get("/bills/done")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    bills: response.data.length
                })
            }
        })
        .catch(error => {console.log(error)})

        get("/bills")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    totalBills: response.data.length
                })
            }
        })
        .catch(error => {console.log(error)})

        get("/imports/done")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    imports: response.data.length
                })
            }
        })
        .catch(error => {console.log(error)})

        get("/imports")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    totalImports: response.data.length
                })
            }
        })
        .catch(error => {console.log(error)})
    }

    toggle() {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }

    toggle1(tab) {
        if (this.state.activeTab1 !== tab) {
            this.setState({
                activeTab1: tab
            });
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
            <Fragment>
                <div>
                    <Row>
                        <Col md="12" lg="6">
                            <Card className="mb-3">
                                <CardHeader className="card-header-tab">
                                    <div className="card-header-title">
                                        <i className="header-icon lnr-rocket icon-gradient bg-tempting-azure"> </i>
                                        Kế Hoạch Dự Kiến
                                    </div>
                                    <div className="btn-actions-pane-right">
                                        <Button outline
                                                className={"border-0 btn-pill btn-wide btn-transition " + classnames({active: this.state.activeTab1 === '11'})}
                                                color="primary" onClick={() => {
                                            this.toggle1('11');
                                        }}>Tab 1</Button>
                                        <Button outline
                                                className={"ml-1 btn-pill btn-wide border-0 btn-transition " + classnames({active: this.state.activeTab1 === '22'})}
                                                color="primary" onClick={() => {
                                            this.toggle1('22');
                                        }}>Tab 2</Button>
                                    </div>
                                </CardHeader>
                                <TabContent activeTab={this.state.activeTab1}>
                                    <TabPane tabId="11">
                                        <CardBody className="pt-2">
                                            <Row className="mt-3">
                                                <Col md="6">
                                                    <div className="widget-content">
                                                        <div className="widget-content-outer">
                                                            <div className="widget-content-wrapper">
                                                                <div className="widget-content-left mr-3">
                                                                    <div className="widget-numbers fsize-3 text-muted">
                                                                        63%{' '}
                                                                    </div>
                                                                </div>
                                                                <div className="widget-content-right">
                                                                    <div className="text-muted opacity-6">
                                                                        &nbsp;Mẫu Mã
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="widget-progress-wrapper mt-1">
                                                                <Progress
                                                                    className="progress-bar-sm progress-bar-animated-alt"
                                                                    color="danger"
                                                                    value="63"/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md="6">
                                                    <div className="widget-content">
                                                        <div className="widget-content-outer">
                                                            <div className="widget-content-wrapper">
                                                                <div className="widget-content-left mr-3">
                                                                    <div className="widget-numbers fsize-3 text-muted">
                                                                        32%{' '}
                                                                    </div>
                                                                </div>
                                                                <div className="widget-content-right">
                                                                    <div className="text-muted opacity-6">
                                                                        &nbsp;Giá Cả
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="widget-progress-wrapper mt-1">
                                                                <Progress
                                                                    className="progress-bar-sm progress-bar-animated-alt"
                                                                    color="success"
                                                                    value="32"/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <div className="divider mt-4"/>
                                            <Row>
                                                <Col md="6">
                                                    <div className="widget-content">
                                                        <div className="widget-content-outer">
                                                            <div className="widget-content-wrapper">
                                                                <div className="widget-content-left mr-3">
                                                                    <div className="widget-numbers fsize-3 text-muted">
                                                                        71%{' '}
                                                                    </div>
                                                                </div>
                                                                <div className="widget-content-right">
                                                                    <div className="text-muted opacity-6">
                                                                        &nbsp;Chất Lượng
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="widget-progress-wrapper mt-1">
                                                                <Progress
                                                                    className="progress-bar-sm progress-bar-animated-alt"
                                                                    color="primary"
                                                                    value="71"/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md="6">
                                                    <div className="widget-content">
                                                        <div className="widget-content-outer">
                                                            <div className="widget-content-wrapper">
                                                                <div className="widget-content-left mr-3">
                                                                    <div className="widget-numbers fsize-3 text-muted">
                                                                        41%{' '}
                                                                    </div>
                                                                </div>
                                                                <div className="widget-content-right">
                                                                    <div className="text-muted opacity-6">
                                                                        &nbsp;Bảo Hàng & Khuyến Mãi
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="widget-progress-wrapper mt-1">
                                                                <Progress
                                                                    className="progress-bar-sm progress-bar-animated-alt"
                                                                    color="warning"
                                                                    value="41"/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                        <div className="widget-chart p-0">
                                            <div className="widget-chart-content">
                                                <div className="widget-description mt-0 text-warning">
                                                    <FontAwesomeIcon icon={faArrowLeft}/>
                                                    <span className="pl-1">80%</span>
                                                    <span className="text-muted opacity-8 pl-1">Mục Tiêu Nâng Cao Sản Phẩm</span>
                                                </div>
                                            </div>
                                            <ResponsiveContainer height={187}>
                                                <AreaChart data={data} margin={{top: -45, right: 0, left: 0, bottom: 0}}>
                                                    <defs>
                                                        <linearGradient id="colorPv2" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="10%" stopColor="var(--warning)" stopOpacity={0.7}/>
                                                            <stop offset="90%" stopColor="var(--warning)" stopOpacity={0}/>
                                                        </linearGradient>
                                                    </defs>
                                                    <Tooltip/>
                                                    <Area type='monotoneX' dataKey='uv' stroke='var(--warning)' strokeWidth={2} fillOpacity={1}
                                                            fill="url(#colorPv2)"/>
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                        
                                    </TabPane>
                                    
                                    <TabPane tabId="22">
                                        <div className="widget-chart p-0">
                                            <ResponsiveContainer height={179}>
                                                <ComposedChart data={data2}>
                                                    <CartesianGrid stroke="#ffffff"/>
                                                    <Area type="monotone" dataKey="amt" fill="#f7ffd0" stroke="#85a200"/>
                                                    <Bar dataKey="pv" barSize={16} fill="var(--primary)"/>
                                                    <Line type="monotone" dataKey="uv" strokeWidth="3" stroke="var(--danger)"/>
                                                </ComposedChart>
                                            </ResponsiveContainer>
                                            <div className="widget-chart-content mt-3 mb-2">
                                                <div className="widget-description mt-0 text-success">
                                                    <FontAwesomeIcon icon={faArrowUp}/>
                                                    <span className="pl-2 pr-2">37.2%</span>
                                                    <span className="text-muted opacity-8">Mục Tiêu Tăng Trưởng</span>
                                                </div>
                                            </div>
                                        </div>
                                    </TabPane>
                                </TabContent>
                                
                            </Card>
                            <div className="card mb-3 widget-chart" style={{height: '220px'}}>
                                <div className="widget-chart-content">
                                    <div className="icon-wrapper rounded-circle">
                                        <div className="icon-wrapper-bg bg-success"/>
                                        <i className="lnr-screen text-success"/>
                                    </div>
                                    <div className="widget-numbers">
                                        1000
                                    </div>
                                    <div className="widget-subheading">
                                        Mục Tiếu Số Lượng Khách Hàng
                                    </div>
                                    <div className="widget-description text-warning">
                                        <span className="pr-1">75.5%</span>
                                        <FontAwesomeIcon icon={faArrowLeft}/>
                                    </div>
                                </div>
                                <div className="widget-chart-wrapper">
                                    <ResponsiveContainer width='100%' aspect={3.0 / 1.0}>
                                        <AreaChart data={data}
                                                    margin={{top: 0, right: 0, left: 0, bottom: 20}}>
                                            <Area type='monotoneX' dataKey='uv' stroke='#fd7e14' fill='#ffb87d'/>
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </Col>
                        <Col md="12" lg="6">
                            <div className="card mb-3 widget-chart">
                                <div className="widget-chart-content">
                                    <div className="icon-wrapper rounded-circle">
                                        <div className="icon-wrapper-bg bg-warning"/>
                                        <i className="lnr-heart icon-gradient bg-premium-dark"> </i>
                                    </div>
                                    <div className="widget-numbers">
                                        10 Đơn Hàng/ Tháng
                                    </div>
                                    <div className="widget-subheading">
                                        Hoạt Động Thương Mại
                                    </div>
                                    <div className="widget-description">
                                        Giảm khoảng{' '}
                                        <span className="text-danger pl-1 pr-1">
                                            <FontAwesomeIcon icon={faAngleDown}/>
                                            <span className="pl-1">54.1%</span>
                                        </span>
                                        {' '}trong 30 ngày vừa qua
                                    </div>
                                </div>
                                <div className="widget-chart-wrapper chart-wrapper-relative">
                                    <ResponsiveContainer height={100}>
                                        <LineChart data={data2}
                                                    margin={{top: 0, right: 5, left: 5, bottom: 0}}>
                                            <Line type="monotone" dataKey="pv" stroke="#d6b5ff" strokeWidth={2}/>
                                            <Line type="monotone" dataKey="uv" stroke="#a75fff" strokeWidth={2}/>
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            <Row>
                                <Col lg="6">
                                    <div className="card mb-3 widget-chart">
                                        <div className="widget-chart-content">
                                            <div className="icon-wrapper rounded-circle">
                                                <div className="icon-wrapper-bg bg-primary"/>
                                                <i className="lnr-cog text-primary"/>
                                            </div>
                                            <div className="widget-numbers">
                                                100k
                                            </div>
                                            <div className="widget-subheading">
                                                Lượt Xem Website
                                            </div>
                                            <div className="widget-description text-success">
                                                <FontAwesomeIcon icon={faAngleUp}/>
                                                <span className="pl-1">75%</span>
                                            </div>
                                        </div>
                                        <div className="widget-chart-wrapper chart-wrapper-relative">
                                            <ResponsiveContainer height={100}>
                                                <LineChart data={data}
                                                            margin={{top: 5, right: 5, left: 5, bottom: 0}}>
                                                    <Line type='monotone' dataKey='pv' stroke='#3ac47d'
                                                            strokeWidth={3}/>
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </Col>
                                <Col lg="6">
                                    <div className="card mb-3 widget-chart">
                                        <div className="widget-chart-content">
                                            <div className="icon-wrapper rounded-circle">
                                                <div className="icon-wrapper-bg bg-danger"/>
                                                <i className="lnr-laptop-phone text-danger"/>
                                            </div>
                                            <div className="widget-numbers">
                                                1 Triệu/ Máy
                                            </div>
                                            <div className="widget-subheading">
                                                Mục Tiêu Hạn Chê Rủi Ro
                                            </div>
                                            <div className="widget-description text-danger">
                                                <FontAwesomeIcon icon={faAngleDown}/>
                                                <span className="pl-1">54.1%</span>
                                            </div>
                                        </div>
                                        <div className="widget-chart-wrapper chart-wrapper-relative">
                                            <ResponsiveContainer height={100}>
                                                <BarChart data={data}>
                                                    <Bar dataKey='uv' fill='#81a4ff' stroke='#3f6ad8' strokeWidth={2}/>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <div className="row">
                        <div className="col-md-6 col-lg-3">
                            <div className="card-shadow-danger mb-3 widget-chart widget-chart2 text-left card">
                                <div className="widget-content">
                                    <div className="widget-content-outer">
                                        <div className="widget-content-wrapper">
                                            <div className="widget-content-left pr-2 fsize-1">
                                                <div className="widget-numbers mt-0 fsize-3 text-danger">{this.state.products}</div>
                                            </div>
                                            <div className="widget-content-right w-100">
                                                <div className="progress-bar-xs progress">
                                                    <div className="progress-bar bg-danger" role="progressbar" aria-valuenow={this.state.products} aria-valuemin="0" aria-valuemax={this.state.totalProducts} style={{ width: `${Math.round((this.state.products/this.state.totalProducts)*100)}%` }}></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="widget-content-left fsize-1">
                                            <div className="font-weight-bold"><b>Tổng Số Máy Playstation</b></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                            <div className="card-shadow-success mb-3 widget-chart widget-chart2 text-left card">
                                <div className="widget-content">
                                    <div className="widget-content-outer">
                                        <div className="widget-content-wrapper">
                                            <div className="widget-content-left pr-2 fsize-1">
                                                <div className="widget-numbers mt-0 fsize-3 text-success">{this.state.users}</div>
                                            </div>
                                            <div className="widget-content-right w-100">
                                                <div className="progress-bar-xs progress">
                                                    <div className="progress-bar bg-success" role="progressbar" aria-valuenow={this.state.users} aria-valuemin="0" aria-valuemax={this.state.totalUsers} style={{ width: `${Math.round((this.state.users/this.state.totalUsers)*100)}%` }}></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="widget-content-left fsize-1">
                                            <div className="font-weight-bold"><b>Tổng Số Tài Khoản Người Dùng</b></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                            <div className="card-shadow-warning mb-3 widget-chart widget-chart2 text-left card">
                                <div className="widget-content">
                                    <div className="widget-content-outer">
                                        <div className="widget-content-wrapper">
                                            <div className="widget-content-left pr-2 fsize-1">
                                                <div className="widget-numbers mt-0 fsize-3 text-warning">{this.state.bills}</div>
                                            </div>
                                            <div className="widget-content-right w-100">
                                                <div className="progress-bar-xs progress">
                                                    <div className="progress-bar bg-warning" role="progressbar" aria-valuenow={this.state.bills} aria-valuemin="0" aria-valuemax={this.state.totalBills} style={{ width: `${Math.round((this.state.bills/this.state.totalBills)*100)}%` }}></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="widget-content-left fsize-1">
                                            <div className="font-weight-bold"><b>Tổng Số Hóa Đơn Đã Thanh Toán</b></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                            <div className="card-shadow-info mb-3 widget-chart widget-chart2 text-left card">
                                <div className="widget-content">
                                    <div className="widget-content-outer">
                                        <div className="widget-content-wrapper">
                                            <div className="widget-content-left pr-2 fsize-1">
                                                <div className="widget-numbers mt-0 fsize-3 text-info">{this.state.imports}</div>
                                            </div>
                                            <div className="widget-content-right w-100">
                                                <div className="progress-bar-xs progress">
                                                    <div className="progress-bar bg-info" role="progressbar" aria-valuenow={this.state.imports} aria-valuemin="0" aria-valuemax={this.state.totalImports} style={{ width: `${Math.round((this.state.imports/this.state.totalImports)*100)}%` }}></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="widget-content-left fsize-1">
                                            <div className="font-weight-bold"><b>Tổng Số Phiếu Nhập Hàng</b></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}
