import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Button, Card, Icon, Image, Menu, Rating} from 'semantic-ui-react'
import { get, post, put } from '../../../Utils/httpHelper';
import {formatCurrency} from "./../../../Utils/Utils";
import ButtonAddToCart from "./ButtonAddToCart";
import { withRouter } from "react-router";
import "../../Product/Product.css";
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
    }
    

    componentDidMount(){
        this.setState({
            user_id: localStorage.getItem('user_id'),
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
                        Price: {formatCurrency(this.props.product.price)}
                    </Card.Meta>

                    <Card.Description>
                        <ButtonAddToCart product={this.props.product}/>
                        <Button color='orange' animated='vertical' className="txtdeco">
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
