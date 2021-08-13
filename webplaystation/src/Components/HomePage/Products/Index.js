import React, { Component } from 'react';
import { Header, Segment, Grid, Pagination, PaginationItem, PaginationLink, Advertisement, Image } from 'semantic-ui-react';
import { get } from '../../../Utils/httpHelper';
import MainMenu from '../MainMenu/MainMenu';
import ProductList from './ProductList';

class Products extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ShoppingCartItems: null,
            Products: [],
            open: false,
            pageToTal: 0,
            activePage: 1
        };
        this.handlePaginationChange = this.handlePaginationChange.bind(this);
    }

    componentDidMount() {
        
        this.state.ShoppingCartItems = JSON.parse(localStorage.getItem('shopping-cart') || '[]');

        get("/products")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    pageToTal: Math.ceil(response.data.length / 8)
                })
            }
        })
        .catch(error => {console.log(error)})

        get(`/products/page?pageNumber=${this.state.activePage-1}&pageSize=8&sortBy=id`)
        .then((response) => {
            this.setState({
                Products: response.data,
            });
        })
        .catch(error => console.log(error));
    }
    
    async handlePaginationChange(e, {activePage}){
        await this.setState({ activePage });
        get(`/products/page?pageNumber=${this.state.activePage-1}&pageSize=8&sortBy=id`)
        .then((response) => {
            this.setState({
                Products: response.data,
            });
        })
        .catch(error => console.log(error))
    }

    componentWillUnmount() {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }

    render() {
        const activePage = this.state.activePage;
        return (
            <Segment style={{ padding: '2em 0em' }} vertical>
                
                <Grid container stackable verticalAlign='middle'>
                <Advertisement unit='billboard' style={{marginLeft:'5em'}}>
                    <Image src="https://game.haloshop.vn/image/cache/catalog/banners/game/categories/ps5-tang-mo-hinh-categories-1280x280.jpg" wrapped/>
                </Advertisement>
                    <Grid.Row>
                        <Grid.Column textAlign='center'>
                            <Header as='h3' style={{ fontSize: '2em' }}>Top Products</Header>
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
        );
    }
}

export default Products;