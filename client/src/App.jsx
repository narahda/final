import React, { useState, useEffect} from "react";
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import Navi from "./components/Header";
import { UserListProvider } from "./context/UserContext";
import Home from "./components/home";
import VideoPlayer from "./components/video/VideoPlayer";
import AddUser from "./components/CreateUser";
import UpdatePwd from "./components/UpdatePwd";
import Bottom from "./components/Bottom";
import Login from "./components/signIn";
import Pic from "./components/pictures";



const App = () => {
  
  const [isAuth, setIsAuth] = useState(false);

  const setAuth = boolean => {
          setIsAuth(boolean);
        };
        
      const checkAuthenticated = async () => {
        try {
          const res = await fetch("http://localhost:8080/auth/is-verify", {
            method: "GET",
            headers: { jwt_token: localStorage.token }
          });
    
          const parseRes = await res.json();
    
          parseRes === true ? setIsAuth(true) : setIsAuth(false);
        } catch (err) {
          console.error(err.message);
        }
      };
    
      useEffect(() => {
        checkAuthenticated();
      }, []);

    

    

    return (
        <React.Fragment>
            <Navi />
            <UserListProvider>
                <div className = "container">
                    <Router>
                        <Switch>
                            <Route exact path = "/" render= {props => !isAuth ? (<Login {...props} setAuth={setAuth} />): (<Redirect to ="/home"/> )}  />
                            <Route exact path = "/home"  render={props => isAuth ? (<Home {...props} setAuth={setAuth} /> ) : (<Redirect to="/" />)} />
                            <Route exact path = "/watch"  render={props => !isAuth ? (<Login {...props} setAuth={setAuth} /> ) : (<Redirect to="/video" />)}/>
                            <Route exact path = "/video" component = {VideoPlayer}/>
                            <Route exact path = "/hello" component = {Pic} />
                            <Route exact path = "/accounts/update" component={UpdatePwd}/>
                            <Route exact path = "/accounts"  render={props => isAuth? (<Home {...props} setAuth={setAuth} />) : <Redirect to = "/accounts"/>}/>
                            <Route exact path = "/register" render={props => !isAuth? (<AddUser {...props} setAuth={setAuth} />) : <Redirect to = "/hello"/>}  />
                        </Switch>
                    </Router>
                </div>
            </UserListProvider>
            <br />
            <br />
            <Bottom />
    </React.Fragment>
)};



export default App;
