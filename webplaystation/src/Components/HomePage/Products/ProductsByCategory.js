import React, { Component } from 'react';
import { Header, Segment, Grid, Pagination } from 'semantic-ui-react';
import { get } from '../../../Utils/httpHelper';
import ProductList from './ProductList';
// import Loading from "../../Components/Loading";
import { withRouter } from "react-router";

class ProductsByCategry extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.match.params.id,
            ShoppingCartItems: null,
            Products: [],
            open: false,
            // loading: true
        };
    }

    componentDidMount() {
        this.state.ShoppingCartItems = JSON.parse(localStorage.getItem('shopping-cart') || '[]');

        // get json data from remote api
        //fetch('https://slacklivechat.com/jsonplaceholder/products')
        // fetch('http://localhost:8080/api/products', {
        //     method: 'GET',
        //     headers: new Headers({
        //         'Content-Type': 'application/json',
        //         'x-access-token': sessionStorage.getItem('token')
        //     })
        // })
        //     .then(res => res.json())
        //     .then((result) => {
        //         //this.state.Products = result.data;
        //         this.setState({
        //             Products: result
        //         });
        //         console.log(result);
        //         this.setState({ loading: false });
        //         this.setState(this.state);
        //     });
        get(`/products/search?categoryId=${this.state.id}`)
        .then((response) => {
            if (response.status === 200)
            {
                console.log(response.data);
                this.setState({Products: response.data});
            }
        })
        .catch(error => {console.log(error)})
    }

    render() {
        return (
            <Segment style={{ padding: '2em 0em' }} vertical>
                <Grid container stackable verticalAlign='middle'>
                    <Grid.Row>
                        <Grid.Column textAlign='center'>
                            <Header as='h3' style={{ fontSize: '2em' }}>Products</Header>
                            <ProductList products={this.state.Products}
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <Grid container stackable verticalAlign='middle'>
                    <Pagination defaultActivePage={1} totalPages={5} />
                </Grid>
            </Segment>
        );
        // if (this.state.loading === false) {
            
        // } else {
        //     return (
        //         <Loading />
        //     );
        // }
    }
}

export default withRouter(ProductsByCategry);