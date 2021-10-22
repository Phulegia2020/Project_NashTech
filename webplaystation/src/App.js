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
import Info from './Components/HomePage/Profile/Info';
import Order from './Components/HomePage/ShoppingCart/Order';
import Success from './Components/HomePage/Pages/Success';
import NotFound from './Components/HomePage/Pages/NotFound';

class App extends React.Component{
    state = {
        sidebarIsOpen: true,
        chatbot: true,
        isOpen: false
    }

    toggleSidebar = () => {
        this.setState({
            sidebarIsOpen: !this.state.sidebarIsOpen,
            // chatbot: false
        })
    };

    handleChatBot = () => {
        this.setState({
            chatbot: false
        })
    }

    handleChatBot1 = (data) => {
        console.log(data);
        this.setState({
            isOpen: data
        })
    }

  render()
  {
      return (
          <Router>
              <Switch>
                  {/* <Route> */}
                  
                  <Route exact path="/" render={() => (
                      <Redirect to="/WebPlayStation"/>
                  )}>
                  </Route>
                  <Route exact path="/WebPlayStation">
                      <MainMenu/>
                      <Products/>
                      {/* <Footer/> */}
                  </Route>
                  <Route exact path="/WebPlayStation/about">
                      <MainMenu/>
                      <About/>
                      <Footer/>
                  </Route>
                  <Route exact path="/WebPlayStation/login">
                      <MainMenu/>
                      <Login handleChatBot={this.handleChatBot}/>
                      <div className="fixed-bottom">
                        <Footer/>
                      </div>
                  </Route>
                  <Route exact path="/WebPlayStation/signup">
                      <MainMenu/>
                      <SignUp handleChatBot={this.handleChatBot}/>
                      <Footer/>
                  </Route>
                  <Route exact path="/WebPlayStation/profile">
                      <MainMenu/>
                      <Info/>
                      <Footer/>
                  </Route>
                  <Route exact path="/WebPlayStation/changpassword">
                      <MainMenu/>
                      <ChangePassword/>
                      <div className="fixed-bottom">
                        <Footer/>
                      </div>
                  </Route>
                  <Route exact path="/WebPlayStation/product/:id">
                      <MainMenu/>
                      <ProductDetails handleChatBot1={this.handleChatBot1}/>
                      <Footer/>
                  </Route>
                  <Route exact path="/WebPlayStation/category/:id">
                      <MainMenu/>
                      <ProductsByCategory/>
                      {/* <div className="fixed-bottom">
                        
                      </div> */}
                      <Footer/>
                  </Route>
                  <Route exact path="/WebPlayStation/order">
                      <MainMenu/>
                      <Order/>
                  </Route>
                  <Route exact path="/WebPlayStation/success">
                      <MainMenu/>
                      <Success/>
                      <div className="fixed-bottom">
                        <Footer/>
                      </div>
                  </Route>
                  <Route exact path="/WebPlayStation/404">
                      <MainMenu/>
                      <NotFound/>
                      <div className="fixed-bottom">
                        <Footer/>
                      </div>
                  </Route>

                  

                  {/* </Route> */}
                  <Router path="/admin">
                    <div className="AppSideBar wrapper">
                        <SideBar toggle={this.toggleSidebar} isOpen={this.state.sidebarIsOpen}/>
                        <Content toggleSidebar={this.toggleSidebar} sidebarIsOpen={this.state.sidebarIsOpen} handleChatBot={this.handleChatBot}/>
                    </div>
                  </Router>

                  
              </Switch>
              {this.state.chatbot === true && <df-messenger
                    intent="WELCOME"
                    chat-title="THE PLAYSTATION SHOP"
                    agent-id="3d2eb8db-0f5e-4a16-9c2a-3cea0cadb3a7"
                    language-code="en"
                    // wait-open="false"
                    // chat-icon="https://media.comicbook.com/2019/02/playstation-logo-orange-1157594.jpeg"
                ></df-messenger>}
          </Router>
      );
  }
}

export default App;
