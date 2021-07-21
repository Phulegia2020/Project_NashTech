import React, {Component} from 'react';
import {Card, Icon, Image, Segment, Grid, Header, Rating} from 'semantic-ui-react'
import ButtonAddToCart from "./ButtonAddToCart";
// import Loading from "../../Components/Loading";
import { get } from '../../../Utils/httpHelper';
import { withRouter } from "react-router";

class ProductDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            Product: {},
            // loading: true
        };
    }

    componentDidMount() {

        this.state.ShoppingCartItems = JSON.parse(localStorage.getItem('shopping-cart') || '[]');

        // fetch('http://localhost:8080/api/products/' + this.props.id)
        //     .then(res => res.json())
        //     .then((data) => {
        //         let product = data;
        //         this.state.Product = product;
        //         this.setState({loading: false});
        //         this.setState(this.state);
        //     });
        get(`/products/${this.props.match.params.id}`)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    Product: response.data
                });
                console.log(this.state.Product);
            }
        })
    }

    formatCurrency(number) {
        var options = {style: 'currency', currency: 'VND'};
        var numberFormat = new Intl.NumberFormat('en-US', options);

        return numberFormat.format(number);
    }

    render() {
        const product = this.state.Product;
        return (
            <Segment style={{padding: '2em 0em', minHeight: 500}} vertical>
                <Grid container stackable verticalAlign='middle'>
                    <Grid.Row>
                        <Grid.Column width={4}>
                            {/* <Image src={product.imageUrl}/> */}
                            <Image src={'https://product.hstatic.net/200000255149/product/ps5_-_2_a2a2c119326c4d93b92f48d51454689e_master.jpg'}/>
                        </Grid.Column>
                        <Grid.Column width={12}>
                            <Header as="h1">{product.name}</Header>
                            <p style={{ fontSize: '1.33em' }}><b>Desciption: </b>{product.description}</p>
                            <p style={{ fontSize: '1.33em' }}><b>Price: </b>{this.formatCurrency(product.price)}</p>
                            {/* <Header as="h4">Discount: {product.discount}</Header> */}
                            <Rating icon='star' defaultRating={5} maxRating={5}/>
                            <Header as="h4">
                                <ButtonAddToCart product={product}/>
                            </Header>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>

            </Segment>
        );
        // if (this.state.loading === false) {
            
        // } else {
        //     return (
        //         <Loading/>
        //     );
        // }
    }
}

export default withRouter(ProductDetails);
