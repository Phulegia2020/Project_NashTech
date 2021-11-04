import React, { Component } from 'react';
import { Header, Segment, Grid, Pagination, Divider, Input, Advertisement, Image } from 'semantic-ui-react';
import { get } from '../../../Utils/httpHelper';
import ProductList from './ProductList';
import { withRouter, Link } from 'react-router-dom';
import { UncontrolledCarousel, Jumbotron, Container, Label } from 'reactstrap';
import Footer from '../Footer/Footer';
import './style.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhoneAlt, faThumbsUp, faTruckMoving,
} from "@fortawesome/free-solid-svg-icons";
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import ProductItem from './ProductItem';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class Products extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ShoppingCartItems: null,
            Products: [],
            open: false,
            pageToTal: 0,
            activePage: 1,
            // search: this.props.match.params.search
            search: "",
            price: '0',
            currentPage: 8,
            topRatePS: []
        };
        this.handlePaginationChange = this.handlePaginationChange.bind(this);
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.state.ShoppingCartItems = JSON.parse(localStorage.getItem('shopping-cart') || '[]');

        get("/products/onSale")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    pageToTal: Math.ceil(response.data.length / this.state.currentPage)
                })
                console.log(response.data)
            }
        })
        .catch(error => {console.log(error)})
        get(`/products/pageOnSale?pageNumber=${this.state.activePage-1}&pageSize=${this.state.currentPage}&sortBy=id`)
        .then((response) => {
            this.setState({
                Products: response.data,
            });
            console.log(response.data)
        })
        .catch(error => console.log(error));

        get("/products/totalrating")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    topRatePS: response.data.slice(0, 5),
                }, () => console.log(this.state.topRatePS));
            }
        })
        .catch(error => {console.log(error)})
    }
    
    async handlePaginationChange(e, {activePage}){
        await this.setState({ activePage });
        if (this.state.search === '')
        {
            if (this.state.price != 0)
            {
                get(`/products/pageFilter?type=${this.state.price}&pageNumber=${this.state.activePage-1}&pageSize=${this.state.currentPage}&sortBy=id`)
                .then((response) => {
                    if (response.status === 200)
                    {
                        this.setState({
                            Products: response.data,
                        })
                    }
                })
                .catch((error) => console.log(error));
            }
            else
            {
                get(`/products/pageOnSale?pageNumber=${this.state.activePage-1}&pageSize=${this.state.currentPage}&sortBy=id`)
                .then((response) => {
                    this.setState({
                        Products: response.data,
                    });
                })
                .catch(error => console.log(error))
            }
        }
        else
        {
            get(`/products/namePage?name=${this.state.search}&pageNumber=${this.state.activePage-1}&pageSize=${this.state.currentPage}&sortBy=id`)
            .then((response) => {
                if (response.status === 200)
                {
                    this.setState({Products: response.data});
                }
            })
            .catch(error => {console.log(error)})
        }
    }

    async handleSearch(e){
        e.preventDefault()
        await this.setState({
            search: e.target.value
        })
        if (this.state.search === '')
        {
            get("/products/onSale")
            .then((response) => {
                if (response.status === 200)
                {
                    this.setState({
                        pageToTal: Math.ceil(response.data.length / this.state.currentPage)
                    })
                }
            })
            .catch(error => {console.log(error)})

            get(`/products/pageOnSale?pageNumber=0&pageSize=${this.state.currentPage}&sortBy=id`)
            .then((response) => {
                this.setState({
                    Products: response.data,
                });
            })
            .catch(error => console.log(error));
        }
        else
        {
            get(`/products/name?name=${this.state.search}`)
            .then((response) => {
                if (response.status === 200)
                {
                    this.setState({
                        pageToTal: Math.ceil(response.data.length / this.state.currentPage)
                    })
                }
            })
            .catch(error => {console.log(error)})
            
            get(`/products/namePage?name=${this.state.search}&pageNumber=0&pageSize=${this.state.currentPage}&sortBy=id`)
            .then((response) => {
                if (response.status === 200)
                {
                    this.setState({Products: response.data});
                }
            })
            .catch(error => {console.log(error)})
        }
    }

    changeValue(e){
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    async handleFilter(e) {
        e.preventDefault();
        //console.log(e.target.value);
        await this.setState({
            price: e.target.value
        }, () => console.log(this.state.price))
        get(`/products/filter?type=${this.state.price}`)
        .then((response) => {
            if (response.status === 200)
            {
                //console.log(response.data);
                this.setState({
                    pageToTal: Math.ceil(response.data / this.state.currentPage)
                }, () => console.log(this.state.pageToTal))
            }
        })
        .catch((error) => console.log(error));

        get(`/products/pageFilter?type=${this.state.price}&pageNumber=0&pageSize=${this.state.currentPage}&sortBy=id`)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    Products: response.data,
                })
            }
        })
        .catch((error) => console.log(error));
    }

    warning = () => toast.success("Đã thêm sản phẩm vào giỏ hàng");


    componentWillUnmount() {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }

    render() {
        const activePage = this.state.activePage;
        const items = [
            {
              src: 'https://game.haloshop.vn/image/cache/catalog/banners/game/categories/ps5-tang-may-do-than-nhiet-categories-1280x280.jpg',
              altText: '',
              caption: '',
              header: '',
              key: '1'
            },
            {
              src: 'https://game.haloshop.vn/image/cache/catalog/banners/game/categories/ps4-km-t3-21-categories-1280x280.jpg',
              altText: '',
              caption: '',
              header: '',
              key: '2'
            },
            {
              src: 'https://game.haloshop.vn/image/cache/catalog/banners/game/categories/ps5-tang-mo-hinh-categories-1280x280.jpg',
              altText: '',
              caption: '',
              header: '',
              key: '3'
            }
          ];
          const options = {
            loop: true,
            margin: 10,
            autoplay: true,
            autoplayTimeout: 2000,
            autoplayHoverPause: true,
            items: 4,
            responsive: {
              0: {
                items: 1
              },
              400: {
                items: 2
              },
              600: {
                items: 3
              },
              800: {
                items: 4
              },
            //   1000: {
            //     items: 5
            //   }
            }
          };
        return (
            <div>
                {/* <div className="carousel slide carousel-multi-item mb-3" data-ride="carousel">
                    <div className="carousel-inner">
                        <div className="container">
                            <div className="owl-carousel owl-theme">
                                
                                    <div className="col-md-4 item" style={{width:'20rem'}}>
                                        <div className="card">
                                            <img src="" alt="Img1" class="card-img-top"/>
                                            <div className="card-body">
                                                <h4 className="card-title">name1</h4>
                                                <p className="card-text">
                                                    <span>Giá: </span> VNĐ
                                                </p>
                                                <a href="shopping-cart/add/${l.id}.html" className="btn btn-danger ml-3">Mua ngay</a> 
                                                <a href="detail/${l.id}.html" className="btn btn-success ml-3">Xem chi tiết</a>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-4 item" style={{width:'20rem'}}>
                                        <div className="card">
                                            <img src="" alt="Img1" className="card-img-top"/>
                                            <div className="card-body">
                                                <h4 className="card-title">name2</h4>
                                                <p className="card-text">
                                                    <span>Giá: </span> VNĐ
                                                </p>
                                                <a href="shopping-cart/add/${l.id}.html" className="btn btn-danger ml-3">Mua ngay</a> 
                                                <a href="detail/${l.id}.html" className="btn btn-success ml-3">Xem chi tiết</a>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-4 item" style={{width:'20rem'}}>
                                        <div className="card">
                                            <div className="card-body">
                                                <h4 className="card-title">name3</h4>
                                                <p className="card-text">
                                                    <span>Giá: </span> VNĐ
                                                </p>
                                                <a href="shopping-cart/add/${l.id}.html" className="btn btn-danger ml-3">Mua ngay</a> 
                                                <a href="detail/${l.id}.html" className="btn btn-success ml-3">Xem chi tiết</a>
                                            </div>
                                        </div>
                                    </div>
                            </div>
                        </div>
                    </div>
                </div> */}
            <Segment style={this.state.Products.length > 0 ? { padding: '2em 0em' }:{ padding: '2em 0em', marginBottom: '181px' }} vertical>
                {/* <Jumbotron fluid className='jumb'>
                    <Container fluid>
                        <h3 style={{textAlign:'center'}}>Lọc Theo Giá</h3>
                        <hr className="my-2" />
                        <Label>
                            <input type="radio" name="price" value = '1' checked={this.state.price === '1'} onChange={(e) => this.handleFilter(e)}/>{' '}
                            Dưới 10 Triệu
                        </Label>
                        <br></br>
                        <Label>
                            <input type="radio" name="price" value = '2' checked={this.state.price === '2'} onChange={(e) => this.handleFilter(e)}/>{' '}
                            Từ 10 Triệu - 15 Triệu
                        </Label>
                        <br/>
                        <Label>
                            <input type="radio" name="price" value = '3' checked={this.state.price === '3'} onChange={(e) => this.handleFilter(e)}/>{' '}
                            Trên 15 Triệu
                        </Label>
                        <br/>
                        <Label>
                            <input type="radio" name="price" value = '0' checked={this.state.price === '0'} onChange={(e) => this.handleFilter(e)}/>{' '}
                            Tất Cả
                        </Label>
                    </Container>
                </Jumbotron> */}
                <Grid container stackable verticalAlign='middle'>
                    <UncontrolledCarousel items={items} controls={false}/>
                    {/* <Advertisement unit='billboard' style={{marginLeft:'5em'}}>
                        <Image src="https://game.haloshop.vn/image/cache/catalog/banners/game/categories/ps5-tang-mo-hinh-categories-1280x280.jpg" wrapped/>
                    </Advertisement> */}
                
                    <Grid.Row>
                        <Grid.Column textAlign='center'>
                            {/* <Header as='h3' style={{ fontSize: '2em' }}>Top Products</Header> */}
                            <Divider horizontal >
                                {/* <Header as='h1' style={{ fontWeight: '900' }} className="header-home">
                                    
                                    Trang Chủ
                                </Header> */}
                                <Header>
                                    <h3 className="header-home">TRANG CHỦ</h3>
                                </Header>
                            </Divider>
                            <Input
                                label={{content: 'Tìm Kiếm:', color: 'blue'}}
                                style={{marginBottom: '1rem'}}
                                placeholder="Tên Sản Phẩm..."
                                value={this.state.search}
                                onChange={(e) => this.handleSearch(e)}
                                icon="search"
                                id="input-search"
                            />
                            <div className = "filter-price">
                                <label>Lọc theo: </label>
                                <select type="select" name="price" onChange={(e) => this.handleFilter(e)}>
                                    <option value="0">Giá</option>
                                    <option value="3">Trên 15 Triệu</option>
                                    <option value="2">Từ 10 Triệu - 15 Triệu</option>
                                    <option value="1">Dưới 10 Triệu</option>
                                </select>
                            </div>
                            <ProductList products={this.state.Products}
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <Grid container stackable verticalAlign='middle'>
                    <Pagination 
                        activePage={activePage}
                        onPageChange={this.handlePaginationChange}
                        totalPages={this.state.pageToTal}
                        ellipsisItem={null}
                    />
                </Grid>
                <Grid container stackable verticalAlign='middle' id="top-rate-ps">
                    <Grid.Row>
                        <Grid.Column textAlign='center'>
                            <h4 className="header-home">TOP Máy Yêu Thích Nhất</h4>
                            <hr className='hr-header'/>
                            {/* <Grid columns={4}> */}
                            {/* <OwlCarousel className="slider-items owl-carousel" loop margin={10} nav={false} autoplay autoplaySpeed={true} mergeFit={true} animateIn={true} animateOut={true} items={4}> */}
                            <OwlCarousel
                                className="slider-items owl-carousel"
                                {...options}
                                >
                                {
                                    this.state.topRatePS.map((p) =>
                                        <Grid.Column key={p.id} className="item">
                                            <ProductItem product={p} normal={'top-card'} warning={this.warning}/>
                                        </Grid.Column>
                                        // <div className="item"> 
                                        //     <ProductItem product={p} normal={'top-card'}/>
                                        // </div>
                                    )
                                }
                            </OwlCarousel>
                            {/* </Grid> */}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>

            <div>
            
            </div>

            <div className="section-4 bg-dark">
                <div className="container">
                    <div className="row">
                        <div className="col-md-7 p-3">
                            <img
                                src="https://hoanghamobile.com/tin-tuc/wp-content/uploads/2020/06/gia-playstation-5-1.jpg"
                                alt="" height = "300px" width="590px"/>
                        </div>
                        <div className="col-md-5 pt-5">
                            {/* <h1 className="text-white">Khám phá về PlayStation tại cửa hàng chúng tôi</h1> */}
                            <h1 className="text-white">Khám phá chi tiết về cửa hàng chúng tôi</h1>
                            {/* <a href="about.html" class="btn btn-success text-light">Tìm hiểu ngay</a> */}
                            <Link to={`/WebPlayStation/about`} style={{ textDecoration: 'none' }} className="btn btn-success text-light">Tìm hiểu ngay</Link>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="section-3">
                <div className="container">
                    <div className="row pb-3">
                        <div className="col-md-4 mt-3">
                            <div className="d-flex flex-row">
                                {/* <i class="fas fa-phone-alt fa-3x m-2"></i> */}
                                <FontAwesomeIcon icon={faPhoneAlt} className="fas fa-phone-alt fa-3x m-2"/>
                                <div className="d-flex flex-column">
                                    <h3 className="m-2">Tư vấn tận tâm</h3>
                                    {/* <p class="m-2">Gọi ngay: 18009543</p> */}
                                    <p className="m-2">Gọi ngay: (028) 38.295.258</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4 mt-3">
                            <div className="d-flex flex-row">
                                {/* <i class="fas fa-truck fa-3x m-2"></i> */}
                                <FontAwesomeIcon icon={faTruckMoving} className="fas fa-truck fa-3x m-2"/>
                                <div className="d-flex flex-column">
                                    <h3 className="m-2">Giao hàng tận nơi</h3>
                                    <p className="m-2">Giao hàng miễn phí giao hàng nội thành tại
                                        TPHCM, Hà Nội, Đà Nẵng</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 mt-3">
                            <div className="d-flex flex-row pl-5">
                                {/* <i class="fas fa-thumbs-up fa-3x m-2"></i> */}
                                <FontAwesomeIcon icon={faThumbsUp} className="fas fa-thumbs-up fa-3x m-2"/>
                                <div className="d-flex flex-column">
                                    <h3 className="m-2">Sản phẩm</h3>
                                    <p className="m-2">Cam kết hàng chính hãng</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div >
            {/* className={this.state.Products.length > 0 ? '' : 'fixed-bottom'} */}
                    <Footer/>
            </div>

            {/* <df-messenger
                intent="WELCOME"
                chat-title="THE PLAYSTATION SHOP"
                agent-id="3d2eb8db-0f5e-4a16-9c2a-3cea0cadb3a7"
                language-code="en"
            ></df-messenger> */}
            <ToastContainer position="top-right"
                    autoClose={1500}
                    hideProgressBar
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover/>
            
            </div>
        );
    }
}

export default withRouter(Products);