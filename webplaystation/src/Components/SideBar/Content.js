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

class Content extends Component {
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
                </Switch>
            </Container>
        )
    }
}

const PageRoute = () => {
    this.props.history.push("/");
}

export default withRouter(Content);
