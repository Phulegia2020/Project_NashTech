import React, {Component} from 'react';
import {Icon, Segment, Grid, Header, Rating, Divider, Table, Message, Comment, Button, Form, Menu} from 'semantic-ui-react'
import ButtonAddToCart from "./ButtonAddToCart";
import { get, post, put } from '../../../Utils/httpHelper';
import { formatCurrency, formatQuantity } from '../../../Utils/Utils';
import { withRouter } from "react-router";
import './style.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {  Link, Switch, Redirect } from 'react-router-dom';

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
            content: '',
            proHint: [],
            redirect : false,
            image: '',
            images: []
        };
        this.onRating = this.onRating.bind(this);
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.props.handleChatBot1(true);
        this.state.ShoppingCartItems = JSON.parse(localStorage.getItem('shopping-cart') || '[]');
        get(`/products/${this.props.match.params.id}`)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    Product: response.data,
                    totalrating: response.data.totalrating,
                    image: response.data.url_image
                });
                // console.log(this.state.product_id)
                get(`/products/search?categoryId=${this.state.Product.category.id}`)
                .then((response) => {
                    this.setState({
                        proHint: response.data.slice(0, 5)
                        // .filter(p => p.id != this.state.product_id)
                    });
                })
                .catch(error => console.log(error));
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

        get(`/productImages/product/${this.props.match.params.id}`)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    images: response.data
                }, () => console.log(this.state.images));
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
            // alert('Login to rate this product');
            toast.warning("Vui lòng đăng nhập để đánh giá sản phẩm!")
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
                    // alert(`You rated this product. Rating another product, thanks!`);
                    toast.warning("Bạn đã đánh giá sản phẩm này. Cám ơn!")
                }
                else
                {
                    post("/ratings", {ratingPoint: this.state.rate, user_id: this.state.user_id, product_id: this.state.product_id})
                    .then((response) => {
                        if (response.status === 200)
                        {
                            this.handleTotalRating();
                            this.handleUpdateRating(this.state.product_id, this.state.Product);
                            // alert('Thanks for review');
                            //window.location.reload();
                            toast.success("Cám ơn đã đánh giá điểm");
                        }
                    })
                }
            }
        }
    }

    handleUpdateRating(id, data){
        put(`/products/${id}`, {name: data.name, description: data.description, quantity: data.quantity, price: data.price,
                                url_image: data.url_image ,totalrating: this.state.totalrating ,category_id: data.category.id, supplier_id: data.supplier.id,
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
        .catch((error) => toast.warning("Vui lòng đăng nhập để bình luận!"));
    }

    notification = () => toast.success("Đã thêm sản phẩm vào giỏ hàng");

    handleProductHint = (e, id) => {
        e.preventDefault();
        // this.setState({redirect: true, product_id: id}, () => this.props.history.push(`/WebPlayStation/product/${this.state.product_id}`));
        this.props.history.push(`/WebPlayStation/product/${id}`)
    }

    handlePicture = (e, data) => {
        this.setState({
            image: data
        });
    }

    componentWillUnmount() {
        this.props.handleChatBot1(false);
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }

    render() {
        // if (this.state.redirect) {
        //     return <Redirect push to={`/WebPlayStation/product/${this.state.product_id}`} />;
        // }
        const product = this.state.Product;
        return (
            <div className="product-detail">
            <Segment style={{padding: '2em 0em', minHeight: 500}} vertical>
                <Grid container stackable verticalAlign='middle'>
                    <Grid.Row className="table-product">
                        <Grid.Column width={4}>
                            {/* <img src={`data:image/jpeg;base64,${product.imageurl}`} alt='PlayStation' className='img-border'/> */}
                            <img src={this.state.image} alt='PlayStation' className='img-border'/>
                            <div className={this.state.images.length > 4 ? "sub-picture-more" : 'sub-picture'}>
                                {this.state.images.length > 0 && <img src={product.url_image} alt='PlayStation' onClick={(e) => this.handlePicture(e, product.url_image)} className="image-main"/>}
                                {this.state.images.map((picture, index) => (
                                    <img src={picture.imagePath} alt='PlayStation' onClick={(e) => this.handlePicture(e, picture.imagePath)} key={index}/>
                                ))}
                                {/* <img src='https://firebasestorage.googleapis.com/v0/b/theplaystation-89769.appspot.com/o/images%2FPlaystation-4-Pro.jpg?alt=media&token=3faa70d0-6298-450f-b640-d76d9fb4b522' alt='PlayStation'/> */}
                            </div>
                        </Grid.Column>
                        <Grid.Column width={12}>
                            <Header as="h1">{product.name}</Header>
                            <hr/>
                            <p style={{ fontSize: '1.33em' }} className="figure-description"><b>Thông Tin: </b>{product.description}</p>
                            <hr/>
                            <p style={{ fontSize: '1.33em' }} className="figure"><b>Giá: </b>{formatCurrency(product.price)}</p>
                            <hr/>
                            <p style={{ fontSize: '1.33em' }} className="figure"><b>Đánh Giá: </b><Rating icon='star'  maxRating={5} onRate={this.onRating} name="rate" rating={this.state.totalrating} disabled/>({product.totalrating}.0/5.0)</p>
                            {/* product.totalrating */}
                            <Message info>
                                <Message.Header>Liên hệ Mua Sản Phẩm: (028) 38.295.258</Message.Header>
                                <p>Vui Lòng Kiểm Tra Số Lượng Của Sản Phẩm Trước Khi Tới Cửa Hàng!</p>
                            </Message>
                            <Message warning>
                            <Message.Header>CAM KẾT & CHÍNH SÁCH</Message.Header>
                                <p>Giá áp dụng khi mua kèm game bất kỳ. 
                                    Giao hàng miễn phí trong vòng 1 - 2 ngày tại nội thành HCM (*)</p>
                            </Message>
                            <Header as="h4">
                                <ButtonAddToCart product={product} notification={this.notification}/>
                            </Header>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Divider horizontal >
                            <Header as='h4'>
                                <Icon name='tag' />
                                MỘT SỐ MÔ TẢ KHÁC
                            </Header>
                        </Divider>

                        <Table definition>
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell width={3}>Nhà Sản Xuất</Table.Cell>
                                    <Table.Cell>{this.state.Product.supplier?.name}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>Loại Máy</Table.Cell>
                                    <Table.Cell>{product.category?.description}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>Thời Hạn Bảo Hành</Table.Cell>
                                    <Table.Cell>3 Năm</Table.Cell>
                                </Table.Row>
                                {/* <Table.Row>
                                    <Table.Cell>CAM KẾT & CHÍNH SÁCH</Table.Cell>
                                    <Table.Cell>Giá áp dụng khi mua kèm game bất kỳ. Giao hàng miễn phí nội thành HCM (*)</Table.Cell>
                                </Table.Row> */}
                                <Table.Row>
                                    <Table.Cell>Số Lượng Còn Lại</Table.Cell>
                                    <Table.Cell>{product.quantity === 0 ? 'Hết Hàng' : `${formatQuantity(product.quantity)} Máy`}</Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table>
                    </Grid.Row>

                    <Grid.Row>
                        <Divider horizontal >
                                <Header as='h4'>
                                    <Icon name='star' />
                                    ĐÁNH GIÁ CỦA BẠN
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
                        <Grid.Column className="grid-comments" width={16} style={{marginLeft: '18em'}}>
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
                                    <Button content='Đăng' labelPosition='left' icon='edit' primary/>
                                </Form>
                            </Comment.Group>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <div className="product-hint">
                            <Icon name='tags' size="large"></Icon>{' '}
                            <span><b>Gợi ý: </b></span>
                            {this.state.proHint.map((p, index) => (
                                p.id !== parseInt(this.state.product_id) &&
                                
                                // <Link to={`/WebPlayStation/product/${p.id}`} key={index} style={{ textDecoration: 'none' }} onClick={(e) => this.handleProductHint(e, p.id)}>Máy {p.name}, </Link>
                                
                                <a href={`/WebPlayStation/product/${p.id}`} key={index}>Máy {p.name} </a>

                                // <span key={index} onClick={(e) => this.handleProductHint(e, p.id)}>Máy {p.name}, </span>

                                // <Menu.Item as={Link} to={`/WebPlayStation/product/${p.id}`} name="home">
                                //              Máy {p.name}, 
                                // </Menu.Item>
                            ))}
                            <span>...</span>
                        </div>
                    </Grid.Row>
                </Grid>

                
                
                
            </Segment>
            
            {/* <df-messenger
                intent="WELCOME"
                chat-title="THE PLAYSTATION SHOP"
                agent-id="3d2eb8db-0f5e-4a16-9c2a-3cea0cadb3a7"
                language-code="en"
            ></df-messenger> */}
            <ToastContainer position="top-right"
                    autoClose={1500}
                    hideProgressBar
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover/>

            
            </div>
        );
    }
}

export default withRouter(ProductDetails);
