import logo from './logo.svg';
import './App.css';
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import React from "react";
import NavBar from "./Components/NavBar/NavBar"
import Category from "./Components/Category/Category"
import Add from './Components/Category/Add';
import UpdateCategory from './Components/Category/UpdateCategory';
import User from './Components/User/User';
import UpdateUser from './Components/User/UpdateUser';
import Product from './Components/Product/Product';
import UpdateProduct from './Components/Product/UpdateProduct';
import ProductsByCategory from './Components/HomePage/Products/ProductsByCategory';
import Login from './Components/Login/Index';
import MainMenu from './Components/HomePage/MainMenu/MainMenu';
import About from './Components/HomePage/About/About';
import Footer from './Components/HomePage/Footer/Footer';
import Products from './Components/HomePage/Products/Index';
import ProductDetails from './Components/HomePage/Products/ProductDetails';
import SignUp from './Components/HomePage/SignUp/SignUp';
import ProductByCategory from './Components/Category/ProductByCategory';
import ChangePassword from './Components/HomePage/ChangePassword/ChangePassword';
import SideBar from './Components/SideBar/SideBar';
import Content from './Components/SideBar/Content';
import { withRouter } from "react-router";

class App extends React.Component{
    state = {
        sidebarIsOpen: true
    }

    toggleSidebar = () => {
        this.setState({
            sidebarIsOpen: !this.state.sidebarIsOpen
        })
    };

    onAdminOut(){
        // return <Redirect to="/"/>
    }

  render()
  {
      return (
          <Router>
              <Switch>
                  <Route exact path="/" render={() => (
                      <Redirect to="/WebPlayStation"/>
                  )}>
                  </Route>
                  <Route exact path="/WebPlayStation">
                      <MainMenu/>
                      <Products/>
                      <Footer/>
                  </Route>
                  <Route exact path="/WebPlayStation/about">
                      <MainMenu/>
                      <About/>
                      <Footer/>
                  </Route>
                  <Route exact path="/WebPlayStation/login">
                      <MainMenu/>
                      <Login/>
                      <Footer/>
                  </Route>
                  <Route exact path="/WebPlayStation/signup">
                      <MainMenu/>
                      <SignUp/>
                      <Footer/>
                  </Route>
                  <Route exact path="/WebPlayStation/profile">
                      <MainMenu/>
                      <ChangePassword/>
                      <Footer/>
                  </Route>
                  <Route exact path="/WebPlayStation/product/:id">
                      <MainMenu/>
                      <ProductDetails/>
                      <Footer/>
                  </Route>
                  <Route exact path="/WebPlayStation/category/:id">
                      <MainMenu/>
                      <ProductsByCategory/>
                      <Footer/>
                  </Route>

                  <Router path="/admin">
                    <div className="AppSideBar wrapper">
                        <SideBar toggle={this.toggleSidebar} isOpen={this.state.sidebarIsOpen} onAdminOut={this.onAdminOut}/>
                        <Content toggleSidebar={this.toggleSidebar} sidebarIsOpen={this.state.sidebarIsOpen} />
                    </div>
                  </Router>

                  {/* <Route exact path="/admin/category">
                      <NavBar/>
                      <Category/>
                  </Route>
                  <Route exact path="/admin/category/update/:id">
                      <NavBar/>
                      <UpdateCategory/>
                  </Route>
                  <Route exact path="/admin/user">
                      <NavBar/>
                      <User/>
                  </Route>
                  <Route exact path="/admin/user/update/:id">
                      <NavBar/>
                      <UpdateUser/>
                  </Route>
                  <Route exact path="/admin/product">
                      <NavBar/>
                      <Product/>
                  </Route>
                  <Route exact path="/admin/product/update/:id">
                      <NavBar/>
                      <UpdateProduct/>
                  </Route>
                  <Route exact path="/admin/category/:id">
                      <NavBar/>
                      <ProductByCategory/>
                  </Route> */}
              </Switch>
          </Router>
      );
  }
}

const PageRoute = ({match}) => (
    <div>
        <MainMenu activeItem={match.params.page != null ? match.params.page : "WebPlayStation"}/>
    </div>
)

export default App;
