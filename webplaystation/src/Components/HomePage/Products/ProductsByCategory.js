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

        // window.onbeforeunload = function () {
        //     window.history.replaceState(null, "");
        // }.bind(this);
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
                {/* , marginTop: '56px' */}
                <Grid container stackable verticalAlign='middle'>
                    <Grid.Row>
                        <Grid.Column textAlign='center'>
                            {/* <Header as='h3' style={{ fontSize: '2em' }}>Products</Header> */}
                            <Divider horizontal style={{marginBottom: '45px'}}>
                                {/* <Header as='h1'>
                                    Sản Phẩm
                                </Header> */}
                                <Header>
                                    <h3 className="header-home">Máy PS</h3>
                                </Header>
                            </Divider>
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
                {/* <df-messenger
                intent="WELCOME"
                chat-title="THE PLAYSTATION SHOP"
                agent-id="3d2eb8db-0f5e-4a16-9c2a-3cea0cadb3a7"
                language-code="en"
                // wait-open="true"
                // chat-icon="https://media.comicbook.com/2019/02/playstation-logo-orange-1157594.jpeg"
                ></df-messenger> */}
            </Segment>
        );
    }
}

export default withRouter(ProductsByCategry);