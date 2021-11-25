import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Button, Card, Icon, Image, Menu, Rating} from 'semantic-ui-react';
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
