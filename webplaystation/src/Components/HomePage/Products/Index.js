import React, { Component } from 'react';
import { Header, Segment, Grid, Pagination, Divider, Input, Advertisement, Image } from 'semantic-ui-react';
import { get } from '../../../Utils/httpHelper';
import ProductList from './ProductList';
import { withRouter } from 'react-router-dom';
import { UncontrolledCarousel, Jumbotron, Container, Label } from 'reactstrap';
import Footer from '../Footer/Footer';
import './style.css';

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
            price: ''
        };
        this.handlePaginationChange = this.handlePaginationChange.bind(this);
    }

    componentDidMount() {
        this.state.ShoppingCartItems = JSON.parse(localStorage.getItem('shopping-cart') || '[]');

        get("/products/onSale")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    pageToTal: Math.ceil(response.data.length / 8)
                })
                console.log(response.data)
            }
        })
        .catch(error => {console.log(error)})
        get(`/products/pageOnSale?pageNumber=${this.state.activePage-1}&pageSize=8&sortBy=id`)
        .then((response) => {
            this.setState({
                Products: response.data,
            });
            console.log(response.data)
        })
        .catch(error => console.log(error));
    }
    
    async handlePaginationChange(e, {activePage}){
        await this.setState({ activePage });
        if (this.state.search === '')
        {
            get(`/products/pageOnSale?pageNumber=${this.state.activePage-1}&pageSize=8&sortBy=id`)
            .then((response) => {
                this.setState({
                    Products: response.data,
                });
            })
            .catch(error => console.log(error))
        }
        else
        {
            get(`/products/namePage?name=${this.state.search}&pageNumber=${this.state.activePage-1}&pageSize=8&sortBy=id`)
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
                        pageToTal: Math.ceil(response.data.length / 8)
                    })
                }
            })
            .catch(error => {console.log(error)})

            get(`/products/pageOnSale?pageNumber=0&pageSize=8&sortBy=id`)
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
                        pageToTal: Math.ceil(response.data.length / 8)
                    })
                }
            })
            .catch(error => {console.log(error)})
            
            get(`/products/namePage?name=${this.state.search}&pageNumber=0&pageSize=8&sortBy=id`)
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
            <Segment style={{ padding: '2em 0em' }} vertical>
                <Jumbotron fluid className='jumb'>
                    <Container fluid>
                        <h3 style={{textAlign:'center'}}>Lọc Theo Giá</h3>
                        {/* <p className="lead">This is a simple hero unit, a simple Jumbotron-style component for calling extra attention to featured content or information.</p> */}
                        <hr className="my-2" />
                        {/* <p>It uses utility classes for typography and spacing to space content out within the larger container.</p>
                        <p className="lead">
                        <Button color="primary">Learn More</Button>
                        </p> */}
                        <Label check>
                            <Input type="radio" name="price" value = '1000000' onChange={(e) => this.changeValue(e)}/>{' '}
                            Dưới 1 Triệu
                        </Label>
                        <br></br>
                        <Label check>
                            <Input type="radio" name="price" value = '5000000' onChange={(e) => this.changeValue(e)}/>{' '}
                            Từ 1 Triệu - 10 Triệu
                        </Label>
                        <br/>
                        <Label check>
                            <Input type="radio" name="price" value = '10000000' onChange={(e) => this.changeValue(e)}/>{' '}
                            Trên 10 Triệu
                        </Label>
                        <br/>
                        <Label check>
                            <Input type="radio" name="price" value = '0' defaultChecked onChange={(e) => this.changeValue(e)}/>{' '}
                            None
                        </Label>
                    </Container>
                </Jumbotron>
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
                                label='Tìm Kiếm:'
                                style={{marginBottom: '1rem'}}
                                placeholder="Tên Sản Phẩm..."
                                value={this.state.search}
                                onChange={(e) => this.handleSearch(e)}
                                icon="search"
                            />
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
                
            </Segment>
            <div className={this.state.Products.length > 0 ? '' : 'fixed-bottom'}>
                    <Footer/>
            </div>

            {/* <df-messenger
                intent="WELCOME"
                chat-title="THE PLAYSTATION SHOP"
                agent-id="3d2eb8db-0f5e-4a16-9c2a-3cea0cadb3a7"
                language-code="en"
            ></df-messenger> */}

            </div>
        );
    }
}

export default withRouter(Products);