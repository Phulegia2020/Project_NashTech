//import React from "react";
import classNames from "classnames";
import { Container } from "reactstrap";
import { Switch, Route, Redirect } from "react-router-dom";
import Topbar from "./TopBar";
import React, { Component } from 'react'
import Category from "../Category/Category";
import Product from '../Product/Product';
import User from '../User/User';
import ProductByCategory from '../Category/ProductByCategory';
import UpdateCategory from '../Category/UpdateCategory';
import UpdateProduct from '../Product/UpdateProduct';
import UpdateUser from '../User/UpdateUser';
import { withRouter } from "react-router";
import Bill from "../Bill/Bill";
import UpdateBill from "../Bill/UpdateBill";
import BillDetailsByBill from "../Bill/BillDetailsByBill";
import UpdateBillDetails from "../BillDetails/UpdateBillDetails";
import Supplier from "../Supplier/Supplier";
import UpdateSupplier from "../Supplier/UpdateSupplier";
import PlaceOrder from "../PlaceOrder/PlaceOrder";
import UpdatePlaceOrder from "../PlaceOrder/UpdatePlaceOrder";
import PlaceOrderDetailsByPlaceOrder from "../PlaceOrder/PlaceOrderDetailsByPlaceOrder";
import UpdatePlaceOrderDetails from "../PlaceOrderDetails/UpdatePlaceOrderDetails";
import Import from "../ImportCard/Import";
import UpdateImport from "../ImportCard/UpdateImport";
import ImportDetailsByImport from "../ImportCard/ImportDetailsByImport";
import UpdateImportDetails from "../ImportDetails/UpdateImportDetails";
import Statistical from "../Statistical/Statistical";
import Footer from "./Footer";
import Chart from "../Statistical/Chart";
import Comment from "../Comment/Comment";
import UpdateComment from "../Comment/UpdateComment";
import ChangePassword from "../User/ChangePassword";

class Content extends Component {
    componentDidMount(){
        this.props.handleChatBot();
    }
    
    render() {
        return (
            <Container
                fluid
                className={classNames("contentSidebar", { "is-open": this.props.sidebarIsOpen })}
            >
                <Topbar toggleSidebar={this.props.toggleSidebar} />
                <Switch>
                    <Route exact path="/admin">
                        <Category/>
                        
                    </Route>
                    <Route exact path="/admin/category">
                        <Category/>
                    </Route>
                    <Route exact path="/admin/category/:id">
                        <ProductByCategory/>
                    </Route>
                    <Route exact path="/admin/category/update/:id">
                        <UpdateCategory/>
                    </Route>
                    <Route exact path="/admin/product">
                        <Product/>
                    </Route>
                    <Route exact path="/admin/product/update/:id">
                        <UpdateProduct/>
                    </Route>
                    <Route exact path="/admin/user">
                        <User/>
                    </Route>
                    <Route exact path="/admin/user/update/:id">
                        <UpdateUser/>
                    </Route>
                    <Route exact path="/admin/bill">
                        <Bill/>
                    </Route>
                    <Route exact path="/admin/bill/update/:id">
                        <UpdateBill/>
                    </Route>
                    <Route exact path="/admin/bill/:id">
                        <BillDetailsByBill/>
                    </Route>
                    <Route exact path="/admin/billDetails/update/:id">
                        <UpdateBillDetails/>
                    </Route>
                    <Route exact path="/admin/supplier">
                        <Supplier/>
                    </Route>
                    <Route exact path="/admin/supplier/update/:id">
                        <UpdateSupplier/>
                    </Route>
                    <Route exact path="/admin/placeorder">
                        <PlaceOrder/>
                    </Route>
                    <Route exact path="/admin/placeorder/update/:id">
                        <UpdatePlaceOrder/>
                    </Route>
                    <Route exact path="/admin/placeorder/:id">
                        <PlaceOrderDetailsByPlaceOrder/>
                    </Route>
                    <Route exact path="/admin/placeorderDetails/update/:id">
                        <UpdatePlaceOrderDetails/>
                    </Route>
                    <Route exact path="/admin/import">
                        <Import/>
                    </Route>
                    <Route exact path="/admin/import/update/:id">
                        <UpdateImport/>
                    </Route>
                    <Route exact path="/admin/import/:id">
                        <ImportDetailsByImport/>
                    </Route>
                    <Route exact path="/admin/importDetails/update/:id">
                        <UpdateImportDetails/>
                    </Route>
                    <Route exact path="/admin/statistical">
                        <Statistical/>
                    </Route>
                    <Route exact path="/admin/statistical/chart">
                        <Chart/>
                    </Route>
                    <Route exact path="/admin/comment">
                        <Comment/>
                    </Route>
                    <Route exact path="/admin/comment/update/:id">
                        <UpdateComment/>
                    </Route>
                    <Route exact path="/admin/info">
                        <ChangePassword/>
                    </Route>
                </Switch>
                <Footer/>
            </Container>
        )
    }
}

export default withRouter(Content);
