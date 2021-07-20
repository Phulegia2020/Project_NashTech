import logo from './logo.svg';
import './App.css';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import React from "react";
import NavBar from "./Components/NavBar/NavBar"
import Category from "./Components/Category/Category"
import Add from './Components/Category/Add';
import UpdateCategory from './Components/Category/UpdateCategory';
import User from './Components/User/User';
import UpdateUser from './Components/User/UpdateUser';
import Product from './Components/Product/Product';
import UpdateProduct from './Components/Product/UpdateProduct';
import ProductByCategory from './Components/Category/ProductByCategory';
import Login from './Components/Login/Login';

class App extends React.Component{
  render()
  {
      return (
          <Router>
              <NavBar/>
              <Switch>
                  <Route exact path="/">
                      <Login/>
                  </Route>
                  <Route exact path="/category">
                      <Category/>
                  </Route>
                  <Route exact path="/category/update/:id">
                      <UpdateCategory/>
                  </Route>
                  <Route exact path="/user">
                      <User/>
                  </Route>
                  <Route exact path="/user/update/:id">
                      <UpdateUser/>
                  </Route>
                  <Route exact path="/product">
                      <Product/>
                  </Route>
                  <Route exact path="/product/update/:id">
                      <UpdateProduct/>
                  </Route>
                  <Route exact path="/category/:id">
                      <ProductByCategory/>
                  </Route>
              </Switch>
          </Router>
      );
  }
}

export default App;
