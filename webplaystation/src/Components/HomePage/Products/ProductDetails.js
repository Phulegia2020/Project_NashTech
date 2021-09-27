import React, {Component} from 'react';
import {Icon, Segment, Grid, Header, Rating, Divider, Table, Message, Comment, Button, Form} from 'semantic-ui-react'
import ButtonAddToCart from "./ButtonAddToCart";
import { get, post, put } from '../../../Utils/httpHelper';
import { formatCurrency, formatQuantity } from '../../../Utils/Utils';
import { withRouter } from "react-router";
import './style.css'

class ProductDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            Product: {},
            rate: 0,
            user_id: '',
            product_id: this.props.match.params.id,
            proByRate: [],
            totalrating: 0,
            comments: [],
            content: ''
        };
        this.onRating = this.onRating.bind(this);
    }

    componentDidMount() {

        this.state.ShoppingCartItems = JSON.parse(localStorage.getItem('shopping-cart') || '[]');
        get(`/products/${this.props.match.params.id}`)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    Product: response.data,
                    totalrating: response.data.totalrating
                });
            }
        })

        this.setState({
            user_id: localStorage.getItem('user_id'),
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

        if (localStorage.getItem('user_id') != null)
        {
            get(`/ratings/search?userId=${localStorage.getItem('user_id')}&productId=${this.state.product_id}`)
            .then((response) => {
                if (response.status === 200)
                {
                    this.setState({
                        rate: response.data
                    })
                }
            })
            .catch((error) => {console.log(error)});
        }
        
        get(`/comments/product/${this.state.product_id}`)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    comments: response.data
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

    async onRating(event, data){
        event.preventDefault();
        if (localStorage.getItem('user_id') === null)
        {
            alert('Login to rate this product');
            return;
        }
        if (data.rating !== 0)
        {
            await this.setState({
                rate: data.rating,
            });
            if (this.state.rate !== 0)
            {
                if (this.onCheckRated(this.state.user_id) === true)
                {
                    alert(`You rated this product. Rating another product, thanks!`);
                }
                else
                {
                    post("/ratings", {ratingPoint: this.state.rate, user_id: this.state.user_id, product_id: this.state.product_id})
                    .then((response) => {
                        if (response.status === 200)
                        {
                            this.handleTotalRating();
                            this.handleUpdateRating(this.state.product_id, this.state.Product);
                            alert('Thanks for review');
                            //window.location.reload();
                        }
                    })
                }
            }
        }
    }

    handleUpdateRating(id, data){
        put(`/products/${id}`, {name: data.name, description: data.description, quantity: data.quantity, price: data.price,
                                imageurl: data.imageurl ,totalrating: this.state.totalrating ,category_id: data.category.id, supplier_id: data.supplier.id,
                                status: data.status})
        .then((response) => {
            if (response.status === 200)
            {
            }
        })
    }

    handleTotalRating = () => {
        var sumrating = this.state.rate;
        for (var i = 0; i < this.state.proByRate.length; i++)
        {
            if (this.state.proByRate[i].user_id !== this.state.user_id)
            {
                sumrating = sumrating + this.state.proByRate[i].ratingPoint;
            }
        }
        var total = Math.round((sumrating) / (this.state.proByRate.length+1));
        this.setState({
            totalrating: total,
        });
    }

    changeValue(e){
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleComment = (e) => {
        e.preventDefault();
        const body = JSON.stringify({
            content: e.target.content.value.trim(),
            user_id: localStorage.getItem('user_id'),
            username: localStorage.getItem('username'),
            product_id: this.state.product_id
        });
        //console.log(body);
        post('/comments', body)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    comments: [...this.state.comments, response.data],
                    content: ''
                });
            }
        })
        .catch((error) => alert('Please, Login to Comment!'));
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
                            <img src={`data:image/jpeg;base64,${product.imageurl}`} alt='PlayStation' className='img-border'/>
                        </Grid.Column>
                        <Grid.Column width={12}>
                            <Header as="h1">{product.name}</Header>
                            <p style={{ fontSize: '1.33em' }}><b>Desciption: </b>{product.description}</p>
                            <p style={{ fontSize: '1.33em' }}><b>Price: </b>{formatCurrency(product.price)}</p>
                            <p style={{ fontSize: '1.33em' }}><b>Rating: </b><Rating icon='star'  maxRating={5} onRate={this.onRating} name="rate" rating={this.state.totalrating} disabled/>({product.totalrating}.0/5.0)</p>
                            {/* product.totalrating */}
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
                                    <Table.Cell>Warranty Period</Table.Cell>
                                    <Table.Cell>3 Years</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>The remaining amount</Table.Cell>
                                    <Table.Cell>{product.quantity === 0 ? 'Sold Out' : formatQuantity(product.quantity)}</Table.Cell>
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
                            
                            <Rating icon='star' maxRating={5} name="rate" size="huge" rating={this.state.rate} onRate={this.onRating}/>
                            
                        </Grid.Column>
                    </Grid.Row>

                    <Grid.Row>
                        <Divider horizontal >
                                <Header as='h4'>
                                    <Icon name='comment' />
                                    BÌNH LUẬN ({this.state.comments.length})
                                </Header>
                        </Divider>
                        <Grid.Column width={12} style={{marginLeft: '18em'}}>
                        
                            <Comment.Group>
                                <div className='scroll-table'>
                                    {this.state.comments.map((comment, index) => (
                                        this.state.comments.length > 0 && (
                                            
                                                <Comment key={index}>
                                                    <Comment.Avatar as='a' src='https://www.kindpng.com/picc/m/130-1300217_user-icon-member-icon-png-transparent-png.png' />
                                                    <Comment.Content>
                                                        <Comment.Author>{comment.username}</Comment.Author>
                                                        <Comment.Metadata>{comment.date_comment}
                                                        {/* <div></div> */}
                                                        </Comment.Metadata>
                                                        <Comment.Text>{comment.content}
                                                        {/* <p>
                                                            The hours, minutes and seconds stand as visible reminders that your
                                                            effort put them all there.
                                                        </p>
                                                        <p>
                                                            Preserve until your next run, when the watch lets you see how
                                                            Impermanent your efforts are.
                                                        </p> */}
                                                        </Comment.Text>
                                                    </Comment.Content>
                                                </Comment>
                                                
                                            
                                        )
                                    ))}    
                                </div>
                                <Form reply onSubmit={(e) => this.handleComment(e)}>
                                    <textarea name='content' rows='3' style={{ resize: 'none', marginBottom: '5px' }} onChange={(e) => this.changeValue(e)} value={this.state.content} required></textarea>
                                    <Button content='Post' labelPosition='left' icon='edit' primary/>
                                </Form>
                            </Comment.Group>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                
                
            </Segment>
            
            </div>
        );
    }
}

export default withRouter(ProductDetails);
