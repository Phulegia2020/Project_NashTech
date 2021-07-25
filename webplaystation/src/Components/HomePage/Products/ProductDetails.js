import React, {Component} from 'react';
import {Card, Icon, Image, Segment, Grid, Header, Rating} from 'semantic-ui-react'
import ButtonAddToCart from "./ButtonAddToCart";
// import Loading from "../../Components/Loading";
import { get, post, put } from '../../../Utils/httpHelper';
import { withRouter } from "react-router";

class ProductDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            Product: {},
            // loading: true
            rate: 0,
            user_id: '',
            product_id: this.props.match.params.id,
            proByRate: [],
            totalrating: 0
        };
    }

    componentDidMount() {

        this.state.ShoppingCartItems = JSON.parse(localStorage.getItem('shopping-cart') || '[]');
        get(`/products/${this.props.match.params.id}`)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    Product: response.data
                });
                //console.log(this.state.Product);
            }
        })

        this.setState({
            user_id: sessionStorage.getItem('user_id'),
        })

        get(`/ratings/product/${this.state.product_id}`)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    proByRate: response.data
                })
            }
        })
        .catch(error => console.log(error));
    }

    formatCurrency(number) {
        var options = {style: 'currency', currency: 'VND'};
        var numberFormat = new Intl.NumberFormat('en-US', options);

        return numberFormat.format(number);
    }

    onCheckRated(user_id)
    {
        for (var i = 0; i < this.state.proByRate.length; i++)
        {
            if (this.state.proByRate[i].user_id === user_id)
            {
                return true;
            }
        }
    }

    onRating = (event, data) => {
        event.preventDefault();
        console.log(data);
        //console.log(this.state.rate);
        if (data.rating !== 0)
        {
            this.setState({
                rate: data.rating,
            });
            
            if (this.state.rate !== 0)
            {
                console.log(this.state.rate);
                console.log(sessionStorage.getItem('user_id'));
                console.log(this.state.product_id);
                if (this.onCheckRated(this.state.user_id) === true)
                {
                    alert(`User ${this.state.user_id} rated product ${this.state.product_id}. Rating another product, please!`);
                    // this.props.history.push("/");
                }
                else
                {
                    post("/ratings", {ratingPoint: this.state.rate, user_id: this.state.user_id, product_id: this.state.product_id})
                    .then((response) => {
                        if (response.status === 200)
                        {
                            console.log(response.data);
                            this.handleTotalRating();
                            this.handleUpdateRating(this.state.product_id, this.state.Product);
                            alert(`User ${this.state.user_id} rated product ${this.state.product_id} is ${this.state.rate}`);
                            window.location.reload();
                            //this.props.history.push(`/WebPlayStation/product/${this.state.product_id}`);
                        }
                    })
                    .catch(error => alert('Login, please!'));
                }
            }
            
        }
    }

    handleUpdateRating(id, data){
        put(`/products/${id}`, {name: data.name, description: data.description, quantity: data.quantity, price: data.price,
                                        imageurl: data.imageurl ,totalrating: this.state.totalrating ,category_id: data.category_id, supplier_id: data.supplier_id})
        .then((response) => {
            if (response.status === 200)
            {
                //console.log(response.data);
                //this.props.history.push("/product");
            }
        })
    }

    handleTotalRating = () => {
        var sumrating = this.state.rate;
        console.log(sumrating);
        for (var i = 0; i < this.state.proByRate.length; i++)
        {
            if (this.state.proByRate[i].user_id !== this.state.user_id)
            {
                sumrating = sumrating + this.state.proByRate[i].ratingPoint;
            }
        }
        //console.log(sumrating);
        //console.log(this.state.proByRate.length);
        var total = Math.round((sumrating) / (this.state.proByRate.length+1));
        console.log(total);
        this.setState({
            totalrating: total,
        });
        //console.log(this.state.totalrating);
    }

    render() {
        const product = this.state.Product;
        return (
            <Segment style={{padding: '2em 0em', minHeight: 500}} vertical>
                <Grid container stackable verticalAlign='middle'>
                    <Grid.Row>
                        <Grid.Column width={4}>
                            <Image src={`data:image/jpeg;base64,${product.imageurl}`}/>
                            {/* <Image src={'https://product.hstatic.net/200000255149/product/ps5_-_2_a2a2c119326c4d93b92f48d51454689e_master.jpg'}/> */}
                        </Grid.Column>
                        <Grid.Column width={12}>
                            <Header as="h1">{product.name}</Header>
                            <p style={{ fontSize: '1.33em' }}><b>Desciption: </b>{product.description}</p>
                            <p style={{ fontSize: '1.33em' }}><b>Price: </b>{this.formatCurrency(product.price)}</p>
                            <Rating icon='star'  maxRating={5} onRate={this.onRating} name="rate" rating={product.totalrating}/>
                            <Header as="h4">
                                <ButtonAddToCart product={product}/>
                            </Header>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>

            </Segment>
        );
    }
}

export default withRouter(ProductDetails);
