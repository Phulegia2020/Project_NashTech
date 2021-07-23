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

class App extends React.Component{
  render()
  {
      return (
          <Router>
              {/* <MainMenu/> */}
              {/* <NavBar/> */}
              
              <Switch>
                  {/* <Route path="/" >
                    <MainMenu/>
                  </Route> */}
                  
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

                  <Route exact path="/admin/category">
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
                  </Route>
              </Switch>
              {/* <div className="fixed-bottom">
                <Footer/>
              </div> */}
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
