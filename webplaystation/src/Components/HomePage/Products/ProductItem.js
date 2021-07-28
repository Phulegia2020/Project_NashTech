import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Button, Card, Icon, Image, Menu, Rating} from 'semantic-ui-react'
import { get, post, put } from '../../../Utils/httpHelper';
import ButtonAddToCart from "./ButtonAddToCart";
import { withRouter } from "react-router";
const styles = {
    link: {
        color: '#ffffff'
    }
}

class ProductItem extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            rate: 0,
            user_id: '',
            product_id: this.props.product.id,
            proByRate: [],
            ratings: [],
            name: "",
            description: "",
            quantity: '',
            price: '',
            totalrating: 0,
            imageurl: null,
            category_id: "",
            supplier_id: "",
            check: false
        }
        this.onRating = this.onRating.bind(this);
    }
    

    componentDidMount(){
        this.setState({
            user_id: sessionStorage.getItem('user_id'),
        })
        
        get('/ratings')
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    ratings: response.data,
                });
            }
        })
        .catch(error => console.log(error));

        get(`/products/${this.state.product_id}`)
        .then((response) => {
            //console.log(response.data);
            if (response.status === 200)
            {
                this.setState({
                    name: response.data.name,
                    description: response.data.description,
                    quantity: response.data.quantity,
                    price: response.data.price,
                    totalrating: response.data.totalrating,
                    imageurl: response.data.imageurl,
                    category_id: response.data.category_id,
                    supplier_id: response.data.supplier_id,
                })
            }
        });
    }

    onCheckRated(user_id, product_id)
    {
        for (var i = 0; i < this.state.ratings.length; i++)
        {
            if (this.state.ratings[i].user_id === user_id )
            {
                if (this.state.ratings[i].product_id === product_id)
                {
                    return true;
                    
                }
            }
        }
    }

    formatCurrency(number) {
        var options = {style: 'currency', currency: 'VND'};
        var numberFormat = new Intl.NumberFormat('en-US', options);

        return numberFormat.format(number);
    }

    async onRating(event, data){
        event.preventDefault();
        // console.log(data);
        if (data.rating !== 0)
        {
            await this.setState({
                rate: data.rating,
            });
            
            if (this.state.rate !== 0)
            {
                if (this.onCheckRated(this.state.user_id, this.state.product_id.toString()) === true)
                {
                    alert(`User ${this.state.user_id} rated product ${this.state.product_id}. Rating another product, please!`);
                }
                else
                {
                    post("/ratings", {ratingPoint: this.state.rate, user_id: this.state.user_id, product_id: this.state.product_id})
                    .then((response) => {
                        if (response.status === 200)
                        {
                            console.log(response.data);
                            get(`/ratings/product/${this.state.product_id}`)
                            .then((response) => {
                                if (response.status === 200)
                                {
                                    this.setState({
                                        proByRate: response.data
                                    })

                                    var sumrating = this.state.rate;
                                    for (var i = 0; i < this.state.proByRate.length; i++)
                                    {
                                        if (this.state.proByRate[i].user_id !== this.state.user_id)
                                        {
                                            sumrating = sumrating + this.state.proByRate[i].ratingPoint;
                                        }
                                    }
                                    var total = Math.round((sumrating) / (this.state.proByRate.length));
                                    this.setState({
                                        totalrating: total,
                                    });
                                    put(`/products/${this.state.product_id}`, {name: this.state.name, description: this.state.description, quantity: this.state.quantity, price: this.state.price,
                                                                                totalrating: this.state.totalrating, imageurl:this.state.imageurl ,category_id: this.state.category_id, supplier_id: this.state.supplier_id})
                                    .then((response) => {
                                        if (response.status === 200)
                                        {
                                            console.log(response.data);
                                        }
                                    })
                                }
                            })
                            .catch(error => console.log(error));
                            //alert(`User ${this.state.user_id} rated product ${this.state.product_id} is ${this.state.rate}`);
                        }
                    })
                    .catch(error => alert('Login, please!'));
                }
            }
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
            <Card color='blue'>
                <Image style={{width: '100%'}} src={`data:image/jpeg;base64,${this.props.product.imageurl}`}/>
                <Card.Content>
                    <Card.Header>
                        {this.props.product.name}
                    </Card.Header>
                    <Card.Meta>
                        Price: {this.formatCurrency(this.props.product.price)}
                    </Card.Meta>

                    <Card.Description>
                        <ButtonAddToCart product={this.props.product}/>
                        <Button color='orange' animated='vertical'>
                            <Button.Content visible>
                                <Icon name='browser'/> Detail
                            </Button.Content>
                            <Button.Content hidden>
                                <Menu.Item as={Link} style={styles.link} to={`/WebPlayStation/product/${this.props.product.id}`} name="home">
                                     View detail
                                </Menu.Item>
                            </Button.Content>
                        </Button>
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <Rating icon='star' maxRating={5} onRate={this.onRating} name="rate" rating={this.state.totalrating} disabled/>
                </Card.Content>
            </Card>
        );
    }
}

export default ProductItem;
