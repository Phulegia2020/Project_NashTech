import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Button, Card, Icon, Image, Menu, Rating, Label} from 'semantic-ui-react'
import { get } from '../../../Utils/httpHelper';
import {formatCurrency} from "./../../../Utils/Utils";
import ButtonAddToCart from "./ButtonAddToCart";
import "../../Product/Product.css";
import "./style.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const styles = {
    link: {
        color: '#ffffff'
    }
}

class ProductItem extends Component {
    // constructor(props)
    // {
    //     super(props);
    //     this.state = {
    //         rate: 0,
    //         user_id: '',
    //         product_id: this.props.product.id,
    //         proByRate: [],
    //         ratings: [],
    //         name: "",
    //         description: "",
    //         quantity: '',
    //         price: '',
    //         totalrating: 0,
    //         imageurl: null,
    //         category_id: "",
    //         supplier_id: "",
    //         check: false
    //     }
    // }
    

    // componentDidMount(){
    //     this.setState({
    //         user_id: localStorage.getItem('user_id'),
    //     })
        
    //     get('/ratings')
    //     .then((response) => {
    //         if (response.status === 200)
    //         {
    //             this.setState({
    //                 ratings: response.data,
    //             });
    //         }
    //     })
    //     .catch(error => console.log(error));

    //     get(`/products/${this.state.product_id}`)
    //     .then((response) => {
    //         if (response.status === 200)
    //         {
    //             this.setState({
    //                 name: response.data.name,
    //                 description: response.data.description,
    //                 quantity: response.data.quantity,
    //                 price: response.data.price,
    //                 totalrating: response.data.totalrating,
    //                 imageurl: response.data.imageurl,
    //                 category_id: response.data.category_id,
    //                 supplier_id: response.data.supplier_id,
    //             })
    //         }
    //     });
    // }

    notification = () => toast.success("Đã thêm sản phẩm vào giỏ hàng");

    warning = () => {
        this.props.warning();
    }

    handleNumberCart(data)
    {
        this.props.handleNumberCart(data);
    }

    componentWillUnmount() {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }

    render() {
        return (
            <div>
            <Card color='blue' id={this.props.normal === 'top-card' ? '' : 'ps-card'}>
                {/* <Label as='a' color='orange' ribbon>
                Specs
                </Label> */}
                {/* <Image style={{width: '100%'}} src={this.props.product.url_image || `data:image/jpeg;base64,${this.props.product.imageurl}`} label={{ color: 'red', corner: 'right', icon: 'certificate'}}/> , content: 'HOT' image: 'https://png.pngtree.com/png-vector/20210528/ourlarge/pngtree-hot-sale-flat-icon-vector-png-image_3326630.jpg'*/}
                <Image style={{width: '100%'}} src={this.props.product.url_image || "http://via.placeholder.com/300"} label={this.props.normal === 'top-card' ? { color: 'red', corner: 'right', icon: 'certificate'}: null}/>
                <Card.Content>
                    <Card.Header>
                        {this.props.product.name}
                    </Card.Header>
                    <Card.Meta className="product-price">
                        <b>
                        Giá: {formatCurrency(this.props.product.price)}
                        </b>
                    </Card.Meta>

                    <Card.Description>
                        <ButtonAddToCart product={this.props.product} notification={this.props.normal !== 'top-card' ? this.notification : this.warning} handleNumberCart={this.props.handleNumberCart}/>
                        <Button color='orange' animated='vertical' className="txtdeco">
                            <Button.Content visible>
                                <Icon name='browser'/> Chi Tiết
                            </Button.Content>
                            <Button.Content hidden>
                                <Menu.Item as={Link} style={styles.link} to={`/WebPlayStation/product/${this.props.product.id}`} name="home">
                                     Xem
                                </Menu.Item>
                            </Button.Content>
                        </Button>
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <Rating icon='star' maxRating={5} onRate={this.onRating} name="rate" rating={this.props.product.totalrating} disabled/>
                </Card.Content>
                
            </Card>
            {this.props.normal !== 'top-card' && <ToastContainer position="top-right"
                    autoClose={1500}
                    hideProgressBar
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover/>}
            </div>
        );
    }
}

export default ProductItem;
