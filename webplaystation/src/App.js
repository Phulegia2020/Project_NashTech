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

class App extends React.Component{
  render()
  {
      return (
          <Router>
              <NavBar/>
              <Switch>
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
              </Switch>
          </Router>
      );
  }
}

export default App;
