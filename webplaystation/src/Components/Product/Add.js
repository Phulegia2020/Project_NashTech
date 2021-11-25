import React, { Component } from 'react'
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { get } from '../../Utils/httpHelper';
import "./Product.css";
import { storage } from "../../Utils/Firebase";

export default class Add extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            name: "",
            description: "",
            quantity: 0,
            price: 0,
            image: null,
            url: "",
            image_sub: [],
            category_id: "1",
            supplier_id: "1",
            categories: [],
            suppliers: [],
            base64: "",
            products: [],
            Error: "",
            key: "",
        }
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
                });
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

    async handleCreate(event){
        event.preventDefault();
        await this.setState({
            category_id: event.target.category_id.value,
            supplier_id: event.target.supplier_id.value
        })
        for (let i = 0; i < this.state.products.length; i++)
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
        this.setState({
            key: '',
            Error: '',
        })
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
                    }, () => this.props.onAdd(this.state));
                });
            }
        );
    }

    handleClear = () => {
        this.setState({
            name: "",
            description: "",
            quantity: 0,
            price: 0,
            category_id: "",
            supplier_id: "",
        });
        this.props.onCloseForm();
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
                <Form onSubmit={(event) => this.handleCreate(event)}>
                <FormGroup>
                    <Label htmlFor="name">Tên Máy</Label>
                    <Input type="text" name="name" id="name" placeholder="PlayStation 4" onChange={(e) => this.changeValue(e)} value = {this.state.name} required="required"/>
                    {this.state.key === 'name' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="description">Thông Tin</Label>
                    <textarea style={{resize: 'none', width: '470px'}} rows="3" type="text" name="description" id="description" placeholder="PlayStation 4 Pro" onChange={(e) => this.changeValue(e)} value = {this.state.description} required="required"/>
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="quantity">Số Lượng</Label>
                    <Input type="number" name="quantity" id="quantity" placeholder="1000" onChange={(e) => this.changeValue(e)} value = {this.state.quantity} disabled/>
                    {this.state.key === 'quantity' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="price">Đơn Giá</Label>
                    <Input type="number" name="price" id="price" placeholder="1.000.000 VNĐ" onChange={(e) => this.changeValue(e)} value = {this.state.price} required="required"/>
                    {this.state.key === 'price' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="image">Hình Ảnh Chính</Label>
                    <br></br>
                    <Input type="file" name="image" id="image" accept=".jpeg, .png, .jpg" onChange={(e) => {this.handleChange(e, 'main')}} required="required"/>
                    {this.state.key === 'image' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="image-sub">Các Hình Ảnh Kèm Theo (Tùy Chọn)</Label>
                    <br></br>
                    <Input type="file" name="image-sub" id="image-sub" accept=".jpeg, .png, .jpg" onChange={(e) => {this.handleChange(e, 'list')}} multiple/>
                    {this.state.key === 'image-sub' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                </FormGroup>
                <FormGroup className="mb-2">
                    <Label htmlFor="category">Loại Máy</Label>
                    <select name="category_id" id="category" className="form-control" size="5" onChange={(e) => this.changeValue(e)} required>
                        {
                            this.state.categories.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))
                        }
                    </select>
                </FormGroup>
                <FormGroup className="mb-3">
                    <Label htmlFor="supplier">Nhà Cung Cấp</Label>
                    <select name="supplier_id" id="supplier" className="form-control" size="5" onChange={(e) => this.changeValue(e)} required>
                        {
                            this.state.suppliers.map((s) => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))
                        }
                    </select>
                </FormGroup>
                <div className="mb-1">
                    <Button type="submit" outline color="warning" >Thêm</Button>{' '}
                    <Button outline color="danger" onClick={this.handleClear.bind(this)}>Hủy</Button>
                </div>
                </Form>
            </div>
        )
    }
}
