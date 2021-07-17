import logo from './logo.svg';
import './App.css';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import React from "react";
import NavBar from "./Components/NavBar/NavBar"
import Category from "./Components/Category/Category"
import Add from './Components/Category/Add';

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
                  
              </Switch>
          </Router>
      );
  }
}

export default App;
