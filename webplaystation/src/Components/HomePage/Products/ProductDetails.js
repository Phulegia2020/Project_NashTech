import React, {Component} from 'react';
import {Card, Icon, Image, Segment, Grid, Header, Rating, Divider, Table, Message} from 'semantic-ui-react'
import ButtonAddToCart from "./ButtonAddToCart";
import { get, post, put } from '../../../Utils/httpHelper';
import { withRouter } from "react-router";

class ProductDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            Product: {},
            rate: 0,
            user_id: '',
            product_id: this.props.match.params.id,
            proByRate: [],
            totalrating: 0
        };
        this.onRating = this.onRating.bind(this);
        this.formatDate = this.formatDate.bind(this);
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
                console.log(response.data);
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

    formatDate = (date) => {
        let d = new Date(date);
        let res = d.getDate() + "-"+ parseInt(d.getMonth()+1) +"-"+d.getFullYear();

        return res;
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

    async onRating(event, data){
        event.preventDefault();
        if (data.rating !== 0)
        {
            await this.setState({
                rate: data.rating,
            });
            if (this.state.rate !== 0)
            {
                if (this.onCheckRated(this.state.user_id) === true)
                {
                    alert(`User ${this.state.user_id} rated product ${this.state.product_id}. Rating another product, please!`);
                }
                else
                {
                    post("/ratings", {ratingPoint: this.state.rate, user_id: this.state.user_id, product_id: this.state.product_id})
                    .then((response) => {
                        if (response.status === 200)
                        {
                            //console.log(response.data);
                            this.handleTotalRating();
                            this.handleUpdateRating(this.state.product_id, this.state.Product);
                            //alert(`User ${this.state.user_id} rated product ${this.state.product_id} is ${this.state.rate}`);
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
            }
        })
    }

    handleTotalRating = () => {
        var sumrating = this.state.rate;
        //console.log(sumrating);
        for (var i = 0; i < this.state.proByRate.length; i++)
        {
            if (this.state.proByRate[i].user_id !== this.state.user_id)
            {
                sumrating = sumrating + this.state.proByRate[i].ratingPoint;
            }
        }
        var total = Math.round((sumrating) / (this.state.proByRate.length+1));
        //console.log(total);
        this.setState({
            totalrating: total,
        });
    }

    componentWillUnmount() {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }

    render() {
        const product = this.state.Product;
        return (
            <div>
            <Segment style={{padding: '2em 0em', minHeight: 500}} vertical>
                <Grid container stackable verticalAlign='middle'>
                    <Grid.Row>
                        <Grid.Column width={4}>
                            <Image src={`data:image/jpeg;base64,${product.imageurl}`}/>
                        </Grid.Column>
                        <Grid.Column width={12}>
                            <Header as="h1">{product.name}</Header>
                            <p style={{ fontSize: '1.33em' }}><b>Desciption: </b>{product.description}</p>
                            <p style={{ fontSize: '1.33em' }}><b>Price: </b>{this.formatCurrency(product.price)}</p>
                            <p style={{ fontSize: '1.33em' }}><b>Rating: </b><Rating icon='star'  maxRating={5} onRate={this.onRating} name="rate" rating={product.totalrating} disabled/></p>
                            <Message info>
                                <Message.Header>Contact to Buy Pruduct: (028) 38.295.258</Message.Header>
                                <p>Please check the number of product before going to store!</p>
                            </Message>
                            <Header as="h4">
                                <ButtonAddToCart product={product}/>
                            </Header>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Divider horizontal >
                            <Header as='h4'>
                                <Icon name='tag' />
                                Techonology Specifications
                            </Header>
                        </Divider>

                        {/* <p>
                        Doggie treats are good for all times of the year. Proven to be eaten by
                        99.9% of all dogs worldwide.
                        </p>

                        <Divider horizontal>
                        <Header as='h4'>
                            <Icon name='bar chart' />
                            Specifications
                        </Header>
                        </Divider> */}

                        <Table definition >
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell width={3}>Manufacturer</Table.Cell>
                                    <Table.Cell>{this.state.Product.supplier?.name}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>Type</Table.Cell>
                                    <Table.Cell>{product.category?.description}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>Time Manufacturing</Table.Cell>
                                    <Table.Cell>{this.formatDate(product.createddate)}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>The remaining amount</Table.Cell>
                                    <Table.Cell>{product.quantity}</Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table>
                    </Grid.Row>

                    <Grid.Row>
                        <Divider horizontal >
                                <Header as='h4'>
                                    <Icon name='star' />
                                    YOUR REVIEW
                                </Header>
                        </Divider>
                        <Grid.Column width={12} style={{marginLeft: '36em'}}>
                            <Rating icon='star'  maxRating={5} onRate={this.onRating} name="rate" rating={product.totalrating} size="huge"/>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                
                
            </Segment>
            
            </div>
        );
    }
}

export default withRouter(ProductDetails);
