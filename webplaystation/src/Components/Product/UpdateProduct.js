import React, { Component } from 'react'
import { withRouter } from "react-router";
import { put, get, del, post } from '../../Utils/httpHelper';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import "../Category/Category.css";
import { storage } from "../../Utils/Firebase";
import "./Product.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faTimesCircle} from "@fortawesome/free-solid-svg-icons";

class UpdateProduct extends Component {
    state = {
        id: this.props.match.params.id,
        name: "",
        description: "",
        quantity: '',
        price: '',
        totalrating: 0,
        imageurl: null,
        image: null,
        url: "",
        image_sub: [],
        pictures: [],
        category_id: "",
        supplier_id: "",
        status:"",
        categories: [],
        suppliers: [],
        base64: "",
        products: [],
        Error: "",
        key: "",
        type_img: ""
    }

    componentDidMount(){
        get("/products/onSale")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({products: response.data});
            }
        })
        .catch(error => {console.log(error)})

        get(`/products/${this.state.id}`)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    name: response.data.name,
                    description: response.data.description,
                    quantity: response.data.quantity,
                    price: response.data.price,
                    totalrating: response.data.totalrating,
                    url: response.data.url_image,
                    category_id: response.data.category.id,
                    supplier_id: response.data.supplier.id,
                    status: response.data.status
                })
            }
        });
        get("/categories")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    categories: response.data
                });
            }
        })

        get("/suppliers")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    suppliers: response.data
                });
            }
        })

        get(`/productImages/product/${this.state.id}`)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    pictures: response.data
                }, () => console.log(this.state.pictures));
            }
        })
        .catch((error) => console.log(error));
    }

    convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
            resolve(fileReader.result);
            };
            fileReader.onerror = (error) => {
            reject(error);
            };
        });
    };

    uploadImage = async (e) => {
        const file = e.target.files[0];
        const base64 = await this.convertBase64(file);
        this.setState({
            base64: base64
        });
        const byteArr = this.state.base64.split(",");
        let photo = byteArr[1];
        this.setState({
            imageurl: photo
        });
    };
    
    handleChange = (e, key) => {
        if (key === 'main')
        {
            if (e.target.files[0]) {
                if (e.target.files[0].size > 10485760)
                {
                    this.setState({
                        key: 'image'
                    })
                    this.setState({
                        Error: "Vui lòng chọn ảnh có dung lượng nhỏ hơn 10MB!"
                    });
                    return;
                }
                this.setState({
                    image: e.target.files[0]
                }, () => console.log(this.state.image));
                this.uploadImage(e);
            }
        }
        else if (key === 'list')
        {
            if (e.target.files.length > 0)
            {
                for (let i = 0; i < e.target.files.length; i++)
                {
                    if (e.target.files[i].size > 10485760)
                    {
                        this.setState({
                            key: 'image-sub'
                        })
                        this.setState({
                            Error: "Vui lòng chọn ảnh có dung lượng nhỏ hơn 10MB!"
                        });
                        return;
                    }
                }
                this.setState({
                    image_sub: e.target.files
                }, () => console.log(this.state.image_sub));
            }
        }
    };

    changeValue(e){
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleUpdate(event){
        event.preventDefault();

        for (let i = 0; i < this.state.products.length; i++)
        {
            if (this.state.products[i].id != this.state.id)
            {
                if (this.state.products[i].name === event.target.name.value.trim())
                {
                    this.setState({
                        key: 'name'
                    })
                    this.setState({
                        Error: "Tên máy này đã được sử dụng!"
                    });
                    return;
                }
            }
        }
        if (event.target.price.value.trim() <= 0)
        {
            this.setState({
                key: 'price'
            })
            this.setState({
                Error: "Giá không nhỏ hơn 1!"
            });
            return;
        }
        if (this.state.image_sub.length > 0)
        {
            for (let i = 0; i < this.state.image_sub.length; i++)
            {
                const uploadTask = storage.ref(`images/${this.state.image_sub[i].name}`).put(this.state.image_sub[i]);
                uploadTask.on(
                    "state_changed",
                    snapshot => {},
                    error => {
                    console.log(error);
                    },
                    () => {
                    storage
                        .ref("images")
                        .child(this.state.image_sub[i].name)
                        .getDownloadURL()
                        .then(url => {
                            post(`/productImages`, {imagePath: url, product_id: this.state.id})
                            .then((response) => {
                                if (response.status === 200)
                                {}
                            })
                            .catch((error) => console.log(error));
                        });
                    }
                );
            }
        }

        if (this.state.image !== null)
        {
            const uploadTask = storage.ref(`images/${this.state.image.name}`).put(this.state.image);
            uploadTask.on(
                "state_changed",
                snapshot => {},
                error => {
                console.log(error);
                },
                () => {
                storage
                    .ref("images")
                    .child(this.state.image.name)
                    .getDownloadURL()
                    .then(url => {
                        this.setState({
                            url: url
                        }, () => {
                            put(`/products/${this.state.id}`, {name: this.state.name.trim(), description:this.state.description.trim(), quantity: this.state.quantity, price: this.state.price,
                                totalrating:this.state.totalrating , url_image: this.state.url, category_id: this.state.category_id, supplier_id: this.state.supplier_id,
                                status: this.state.status})
                            .then((response) => {
                                if (response.status === 200)
                                {
                                    this.props.history.push("/admin/product");
                                }
                            })
                            .catch((error) => {})
                        });
                    });
                }
            );
        }
        else
        {
            put(`/products/${this.state.id}`, {name: this.state.name.trim(), description:this.state.description.trim(), quantity: this.state.quantity, price: this.state.price,
                totalrating:this.state.totalrating , url_image: this.state.url, category_id: this.state.category_id, supplier_id: this.state.supplier_id, status: this.state.status})
            .then((response) => {
                if (response.status === 200)
                {
                    this.props.history.push("/admin/product");
                }
            })
            .catch((error) => {})
        }
    }

    handleDeleleImage = (e, id) => {
        e.preventDefault();
        del(`/productImages/${id}`)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({pictures: this.state.pictures.filter(p => p.id !== id)});
            }
        })
        .catch((error) => console.log(error));
    }

    handleClear = () => {
        this.setState({
            name: "",
            description: "",
            quantity: "",
            price: "",
        });
        this.props.history.push("/admin/product");
    }

    componentWillUnmount() {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }

    render() {
        return (
            <div className="update-form-product">
                <h3>Cập Nhật Máy</h3>
                <Form onSubmit={(event) => this.handleUpdate(event)}>
                    <FormGroup>
                        <Label htmlFor="name">Tên Máy</Label>
                        <Input type="text" name="name" id="name" placeholder="PlayStation" onChange={(e) => this.changeValue(e)} value = {this.state.name} required="required" disabled={this.state.status === 'Stop'}/>
                        {this.state.key === 'name' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="description">Thông Tin</Label><br></br>
                        <textarea style={{resize: 'none', width: '100%'}} rows="3" name="description" id="description" placeholder="PlayStation" onChange={(e) => this.changeValue(e)} value = {this.state.description} required="required" disabled={this.state.status === 'Stop'}></textarea>
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="quantity">Số Lượng</Label>
                        <Input type="number" name="quantity" id="quantity" placeholder="1000" onChange={(e) => this.changeValue(e)} value = {this.state.quantity} disabled/>
                        {this.state.key === 'quantity' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="price">Đơn Giá</Label>
                        <Input type="number" name="price" id="price" placeholder="1.000.000 VNĐ" onChange={(e) => this.changeValue(e)} value = {this.state.price} required="required" disabled={this.state.status === 'Stop'}/>
                        {this.state.key === 'price' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                    </FormGroup>
                    <FormGroup inline className="display-imges">
                    <FormGroup>
                        <Label htmlFor="image">Hình Ảnh Chính</Label>
                        <br></br>
                        <Input type="file" name="image" id="image" accept=".jpeg, .png, .jpg" onChange={(e) => {this.handleChange(e, 'main')}}/>
                        {this.state.key === 'image' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                        <br></br>
                        {this.state.imageurl !== null ? <img src={`data:image/jpeg;base64,${this.state.imageurl}`} alt="" height="150px"></img> : <img src={this.state.url || "http://via.placeholder.com/300"} alt="" height="150px"/>}
                    </FormGroup>
                    <FormGroup className="images-sub">
                        <Label htmlFor="image-sub">Các Hình Ảnh Kèm Theo (Tùy Chọn)</Label>
                        <br></br>
                        <Input type="file" name="image-sub" id="image-sub" accept=".jpeg, .png, .jpg" onChange={(e) => {this.handleChange(e, 'list')}} multiple/>
                        {this.state.key === 'image-sub' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                        <div className={this.state.pictures.length > 5 ? "sub-picture-more" : 'sub-picture'}>
                            {this.state.pictures.map((picture, index) => (
                                <div className="delete-picture">
                                    <span>
                                        <FontAwesomeIcon className="icon-delete" icon={faTimesCircle} onClick={(e) => this.handleDeleleImage(e, picture.id)}/>
                                    </span>
                                    <img src={picture.imagePath} alt='PlayStation' key={index}/>
                                </div>
                            ))}
                        </div>
                    </FormGroup>
                    </FormGroup>
                    <FormGroup className="mb-2">
                        <Label htmlFor="category">Loại Máy</Label>
                        <Input type="select" name="category_id" id="category" value = {this.state.category_id} onChange={(e) => this.changeValue(e)} disabled={this.state.status === 'Stop'}>
                            {
                                this.state.categories.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))
                            }
                        </Input>
                    </FormGroup>
                    <FormGroup className="mb-2">
                        <Label htmlFor="supplier">Nhà Cung Cấp</Label>
                        <Input type="select" name="supplier_id" id="supplier" value = {this.state.supplier_id} onChange={(e) => this.changeValue(e)} disabled={this.state.status === 'Stop'}>
                            {
                                this.state.suppliers.map((s) => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))
                            }
                        </Input>
                    </FormGroup>
                    <div className="mt-3">
                        <Button type="submit" outline color="warning" >Cập Nhật</Button>{' '}
                        <Button outline color="danger" onClick={this.handleClear.bind(this)}>Quay Lại</Button>
                    </div>
                </Form>
            </div>
        )
    }
}

export default withRouter(UpdateProduct);