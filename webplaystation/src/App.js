import './App.css';
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import React from "react";
import ProductsByCategory from './Components/HomePage/Products/ProductsByCategory';
import Login from './Components/Login/Index';
import MainMenu from './Components/HomePage/MainMenu/MainMenu';
import About from './Components/HomePage/About/About';
import Footer from './Components/HomePage/Footer/Footer';
import Products from './Components/HomePage/Products/Index';
import ProductDetails from './Components/HomePage/Products/ProductDetails';
import SignUp from './Components/HomePage/SignUp/SignUp';
import ChangePassword from './Components/HomePage/ChangePassword/ChangePassword';
import SideBar from './Components/SideBar/SideBar';
import Content from './Components/SideBar/Content';

class App extends React.Component{
    state = {
        sidebarIsOpen: true
    }

    toggleSidebar = () => {
        this.setState({
            sidebarIsOpen: !this.state.sidebarIsOpen
        })
    };

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
                        <SideBar toggle={this.toggleSidebar} isOpen={this.state.sidebarIsOpen}/>
                        <Content toggleSidebar={this.toggleSidebar} sidebarIsOpen={this.state.sidebarIsOpen} />
                    </div>
                  </Router>
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
