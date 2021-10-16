import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input, Row, Col } from 'reactstrap';
import { get, put } from '../../Utils/httpHelper';
// import { Select } from 'semantic-ui-react';
import "../Category/Category.css";

class UpdateComment extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            user_id: '',
            users: [],
            product_id: "",
            products: [],
            content: '',
            Error: "",
            key: "",
            id: this.props.match.params.id
        }
    }
    
    componentDidMount(){
        get("/users/customer")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({users: response.data});
            }
        })
        .catch(error => {console.log(error)})

        get("/products")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    products: response.data
                })
            }
        })
        .catch(error => {console.log(error)})

        get(`/comments/${this.state.id}`)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    content: response.data.content,
                    user_id: response.data.user_id,
                    product_id: response.data.product_id
                })
            }
        });
    }

    changeValue(e){
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleUpdate(event){
        event.preventDefault();
        put(`/comments/${this.state.id}`, {content: this.state.content.trim(), user_id: this.state.user_id, product_id: this.state.product_id})
        .then((response) => {
            if (response.status === 200)
            {
                this.props.history.push("/admin/comment");
            }
        })
        //console.log(this.state.user_id);
    }

    handleClear = () => {
        this.setState({
            content: '',
        });
        this.props.history.push("/admin/comment");
    }

    componentWillUnmount() {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }

    render() {
        // const userArr = [];
        // this.state.users.map((u) => userArr.push({key: `${u.id}`, value: `${u.id}`, text: `${u.account}`}))
        return (
            <div className="update-form">
                <h3>Update Bình Luận</h3>
                {/* <Row form>
                    <Col md={4}> */}
                        <Form onSubmit={(event) => this.handleUpdate(event)}>
                        <FormGroup>
                            <Label htmlFor="content">Nội Dung</Label>
                            <br></br>
                            <textarea style={{resize: 'none', width: '100%'}} rows="3" type="text" name="content" id="content" placeholder="Content..." onChange={(e) => this.changeValue(e)} value = {this.state.content} required="required"/>
                        </FormGroup>
                        
                            
                        <FormGroup className="mb-2">
                            <Label htmlFor="user">Khách Hàng</Label>
                            <Input type="select" name="user_id" id="user" onChange={(e) => this.changeValue(e)} value = {this.state.user_id} disabled>
                                {
                                    this.state.users.map((u) => (
                                        <option key={u.id} value={u.id}>{u.name}</option>
                                    ))
                                }
                            </Input>
                            {/* <Select placeholder='Chọn Khách Hàng ...' options={userArr} defaultValue={this.state.user_id} onChange={(e) => this.changeValue(e)}/> */}
                        </FormGroup>
                            
                        <FormGroup className="mb-2">
                            <Label htmlFor="product">Sản Phẩm</Label>
                            <Input type="select" name="product_id" id="product" onChange={(e) => this.changeValue(e)} value = {this.state.product_id} disabled>
                                {
                                    this.state.products.map((p) => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))
                                }
                            </Input>
                        </FormGroup>
                        <div className="mb-5">
                            <Button type="submit" outline color="warning" >Cập Nhật</Button>{' '}
                            <Button outline color="danger" onClick={this.handleClear.bind(this)}>Hủy</Button>
                        </div>
                        </Form>
                    {/* </Col>
                </Row> */}
            </div>
        )
    }
}
export default withRouter(UpdateComment);