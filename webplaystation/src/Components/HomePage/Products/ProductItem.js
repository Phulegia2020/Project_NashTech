import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Button, Card, Icon, Image, Menu, Rating} from 'semantic-ui-react'
import { get, post } from '../../../Utils/httpHelper';
import ButtonAddToCart from "./ButtonAddToCart";
import { withRouter } from "react-router";
const styles = {
    link: {
        color: '#ffffff'
    }
}


class ProductItem extends Component {
    state = {
        rate: 0,
        user_id: '',
        product_id: this.props.product.id,
        proByRate: []
    }

    componentDidMount(){
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

    formatCurrency(number) {
        var options = {style: 'currency', currency: 'VND'};
        var numberFormat = new Intl.NumberFormat('en-US', options);

        return numberFormat.format(number);
    }

    rating = (event, data) => {
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
                // console.log('stop');
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
                            alert(`User ${this.state.user_id} rated product ${this.state.product_id} is ${this.state.rate}`);
                        }
                    })
                    .catch(error => alert('Login, please!'));
                }
            }
            
        }
    }

    render() {
        return (
            <Card color='blue'>
                {/* <Image style={{width: '100%'}} src={this.props.product.image.coverImageUrl}/> */}
                <Image style={{width: '100%'}} src={`https://product.hstatic.net/200000255149/product/ps5_-_2_a2a2c119326c4d93b92f48d51454689e_master.jpg`}/>
                {/* <Image style={{width: '100%'}} src={this.props.product.imageurl}/> */}
                <Card.Content>
                    <Card.Header>
                        {this.props.product.name}
                    </Card.Header>
                    <Card.Meta>
                        Price: {this.formatCurrency(this.props.product.price)}
                    </Card.Meta>
                    {/* <Card.Meta>
                        Discount: {this.props.product.discount}%
                    </Card.Meta> */}

                    <Card.Description>
                        <ButtonAddToCart product={this.props.product}/>
                        <Button color='orange' animated='vertical'>
                            <Button.Content visible>
                                <Icon name='browser'/> Detail
                            </Button.Content>
                            <Button.Content hidden>
                            {/* "/product/" + this.props.product.id */}
                                <Menu.Item as={Link} style={styles.link} to={`/WebPlayStation/product/${this.props.product.id}`} name="home">
                                     View detail
                                </Menu.Item>
                            </Button.Content>
                        </Button>
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <Rating icon='star' defaultRating={5} maxRating={5} onRate={this.rating} name="rate"/>
                    
                </Card.Content>
            </Card>
        );
    }
}

export default ProductItem;
