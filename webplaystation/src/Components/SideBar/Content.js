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
                    {/* <Route exact path="/admin/logout" render={() => (
                      <Redirect to="/WebPlayStation"/>
                    )}>
                    </Route> */}
                    {/* <Route exact path="/admin/logout" component={PageRoute}>
                    </Route> */}
                    {/* <Route exact path="/Home-1" component={() => "Home-1"} />
                    <Route exact path="/Home-2" component={() => "Home-2"} />
                    <Route exact path="/Home-3" component={() => "Home-3"} />
                    <Route exact path="/Page-1" component={() => "Page-1"} />
                    <Route exact path="/Page-2" component={() => "Page-2"} />
                    <Route exact path="/page-1" component={() => "page-1"} />
                    <Route exact path="/page-2" component={() => "page-2"} />
                    <Route exact path="/page-3" component={() => "page-3"} />
                    <Route exact path="/page-4" component={() => "page-4"} /> */}
                </Switch>
            </Container>
        )
    }
}

const PageRoute = () => {
    this.props.history.push("/");
}

// const Content = ({ sidebarIsOpen, toggleSidebar }) => (
//   <Container
//     fluid
//     className={classNames("content", { "is-open": sidebarIsOpen })}
//   >
//     <Topbar toggleSidebar={toggleSidebar} />
//     <Switch>
//       <Route exact path="/" component={() => "Hello"} />
//       <Route exact path="/about" component={() => "About"} />
//       <Route exact path="/Pages" component={() => "Pages"} />
//       <Route exact path="/faq" component={() => "FAQ"} />
//       <Route exact path="/contact" component={() => "Contact"} />
//       <Route exact path="/Home-1" component={() => "Home-1"} />
//       <Route exact path="/Home-2" component={() => "Home-2"} />
//       <Route exact path="/Home-3" component={() => "Home-3"} />
//       <Route exact path="/Page-1" component={() => "Page-1"} />
//       <Route exact path="/Page-2" component={() => "Page-2"} />
//       <Route exact path="/page-1" component={() => "page-1"} />
//       <Route exact path="/page-2" component={() => "page-2"} />
//       <Route exact path="/page-3" component={() => "page-3"} />
//       <Route exact path="/page-4" component={() => "page-4"} />
//     </Switch>
//   </Container>
// );

export default withRouter(Content);
