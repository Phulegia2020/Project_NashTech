import React, { Component } from 'react';
import { Header, Segment, Grid, Pagination, Divider } from 'semantic-ui-react';
import { get } from '../../../Utils/httpHelper';
import ProductList from './ProductList';
import { withRouter } from "react-router";
import './style.css';

class ProductsByCategry extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.match.params.id,
            ShoppingCartItems: null,
            Products: [],
            open: false,
            activePage: 1,
            pageToTal: 0,
        };
        this.handlePaginationChange = this.handlePaginationChange.bind(this);
    }

    componentDidMount() {
        this.state.ShoppingCartItems = JSON.parse(localStorage.getItem('shopping-cart') || '[]');
        get(`/products/search?categoryId=${this.state.id}`)
        .then((response) => {
            this.setState({
                pageToTal: Math.ceil(response.data.length / 4)
            }, () => console.log(this.state.pageToTal));
        })
        .catch(error => console.log(error));

        get(`/products/searchPage?categoryId=${this.state.id}&pageNumber=${this.state.activePage-1}&pageSize=4&sortBy=id`)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({Products: response.data});
            }
        })
        .catch(error => {console.log(error)})
    }

    componentDidUpdate(prevProps, prevState)
    {
        if (prevState.id !== this.state.id)
        {
            get(`/products/search?categoryId=${this.state.id}`)
            .then((response) => {
                this.setState({
                    pageToTal: Math.ceil(response.data.length / 4)
                }, () => console.log(this.state.pageToTal));
            })
            .catch(error => console.log(error));

            get(`/products/searchPage?categoryId=${this.state.id}&pageNumber=${this.state.activePage-1}&pageSize=4&sortBy=id`)
            .then((response) => {
                if (response.status === 200)
                {
                    this.setState({Products: response.data});
                }
            })
            .catch(error => {console.log(error)})
        }
    }

    async handlePaginationChange(e, {activePage}){
        await this.setState({ activePage });
        get(`/products/searchPage?categoryId=${this.state.id}&pageNumber=${this.state.activePage-1}&pageSize=4&sortBy=id`)
        .then((response) => {
            this.setState({
                Products: response.data,
            });
        })
        .catch(error => console.log(error))
    }

    handleNumberCart(data)
    {
        this.props.handleNumberCart(data);
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
            <Segment style={{ padding: '2em 0em', marginBottom: '17px' }} vertical>
                <Grid container stackable verticalAlign='middle'>
                    <Grid.Row>
                        <Grid.Column textAlign='center'>
                            <Divider horizontal style={{marginBottom: '45px'}}>
                                <Header>
                                    <h3 className="header-home">Máy PlayStation</h3>
                                </Header>
                            </Divider>
                            <ProductList products={this.state.Products} handleNumberCart={this.props.handleNumberCart}
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

export default withRouter(ProductsByCategry);