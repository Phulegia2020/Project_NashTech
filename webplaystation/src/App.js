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
import ForgetPassword from './Components/Login/ForgetPassword';
import OTP from './Components/Login/OTP';

class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            sidebarIsOpen: true,
            chatbot: true,
            isOpen: false,
            numberCart: 0
        }
        this.handleNumberCart = this.handleNumberCart.bind(this);
        this.handleChatBot = this.handleChatBot.bind(this);
    }

    componentDidMount()
    {
        const shoppingCartItems = JSON.parse(localStorage.getItem('shopping-cart') || '[]');
        this.setState({
            numberCart: shoppingCartItems.length
        })
    }

    toggleSidebar = () => {
        this.setState({
            sidebarIsOpen: !this.state.sidebarIsOpen,
        })
    };

    handleChatBot = () => {
        this.setState({
            chatbot: false
        })
    }

    handleNumberCart(data)
    {
        this.setState({
            numberCart: data
        });
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
                      <MainMenu numberCart={this.state.numberCart} handleNumberCart={this.handleNumberCart}/>
                      <Products handleNumberCart={this.handleNumberCart}/>
                      <Footer/>
                  </Route>
                  <Route exact path="/WebPlayStation/about">
                      <MainMenu numberCart={this.state.numberCart} handleNumberCart={this.handleNumberCart}/>
                      <About/>
                      <Footer/>
                  </Route>
                  <Route exact path="/WebPlayStation/login">
                      <MainMenu numberCart={this.state.numberCart} handleNumberCart={this.handleNumberCart}/>
                      <Login/>
                      <Footer/>
                  </Route>
                  <Route exact path="/WebPlayStation/signup">
                      <MainMenu numberCart={this.state.numberCart} handleNumberCart={this.handleNumberCart}/>
                      <SignUp/>
                      <Footer/>
                  </Route>
                  <Route exact path="/WebPlayStation/profile">
                      <MainMenu numberCart={this.state.numberCart} handleNumberCart={this.handleNumberCart}/>
                      <Info/>
                      <Footer/>
                  </Route>
                  <Route exact path="/WebPlayStation/changpassword">
                      <MainMenu numberCart={this.state.numberCart} handleNumberCart={this.handleNumberCart}/>
                      <ChangePassword/>
                      <Footer/>
                  </Route>
                  <Route exact path="/WebPlayStation/forgetPassword">
                      <MainMenu numberCart={this.state.numberCart} handleNumberCart={this.handleNumberCart}/>
                      <ForgetPassword/>
                      <div style={{ marginTop: '31.5%' }}>
                        <Footer/>
                      </div>
                  </Route>
                  <Route exact path="/WebPlayStation/confirm">
                      <MainMenu numberCart={this.state.numberCart} handleNumberCart={this.handleNumberCart}/>
                      <OTP/>
                      <div style={{ marginTop: '31.5%' }}>
                        <Footer/>
                      </div>
                  </Route>
                  <Route exact path="/WebPlayStation/product/:id">
                      <MainMenu numberCart={this.state.numberCart} handleNumberCart={this.handleNumberCart}/>
                      <ProductDetails handleNumberCart={this.handleNumberCart}/>
                      <Footer/>
                  </Route>
                  <Route exact path="/WebPlayStation/category/:id">
                      <MainMenu numberCart={this.state.numberCart} handleNumberCart={this.handleNumberCart}/>
                      <ProductsByCategory handleNumberCart={this.handleNumberCart}/>
                      <Footer/>
                  </Route>
                  <Route exact path="/WebPlayStation/order">
                      <MainMenu numberCart={this.state.numberCart} handleNumberCart={this.handleNumberCart}/>
                      <Order/>
                  </Route>
                  <Route exact path="/WebPlayStation/success">
                      <MainMenu numberCart={this.state.numberCart} handleNumberCart={this.handleNumberCart}/>
                      <Success handleNumberCart={this.handleNumberCart}/>
                      <div className="fixed-bottom">
                        <Footer/>
                      </div>
                  </Route>
                  <Route exact path="/WebPlayStation/404">
                      <MainMenu numberCart={this.state.numberCart} handleNumberCart={this.handleNumberCart}/>
                      <NotFound/>
                      <div className="fixed-bottom">
                        <Footer/>
                      </div>
                  </Route>
                  <Router path="/admin">
                    <div className="AppSideBar wrapper">
                        <SideBar toggle={this.toggleSidebar} isOpen={this.state.sidebarIsOpen}/>
                        <Content toggleSidebar={this.toggleSidebar} sidebarIsOpen={this.state.sidebarIsOpen} handleChatBot={this.handleChatBot}/>
                    </div>
                  </Router>
              </Switch>
              {this.state.chatbot === true && <df-messenger
                    intent="WELCOME"
                    chat-title="THE PLAYSTATION SHOP 🎮"
                    agent-id="3d2eb8db-0f5e-4a16-9c2a-3cea0cadb3a7"
                    language-code="en"
                    wait-open
                    chat-icon="https://image.flaticon.com/icons/png/512/588/588258.png"
                    // chat-icon="https://media.comicbook.com/2019/02/playstation-logo-orange-1157594.jpeg"
                    // chat-icon="https://upload.wikimedia.org/wikipedia/vi/3/37/Mortal_Kombat_Logo.png"
                    // chat-icon="https://cdn3.iconfinder.com/data/icons/black-easy/512/538309-game_512x512.png"
                ></df-messenger>}
           </Router>
      );
  }
}

export default App;
