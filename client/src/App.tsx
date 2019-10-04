import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import {
  faEnvelopeOpen,
  faPhone,
  faInfoCircle,
  faTimesCircle,
  faSignOutAlt,
  faFileContract
} from "@fortawesome/free-solid-svg-icons";

import Navbar from "./components/layout/Navbar";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Alerts from "./components/layout/Alerts";
import Home from "./components/pages/Home";
import About from "./components/pages/About";
import NotFound from "./components/pages/NotFound";
import PrivateRoute from "./components/routing/PrivateRoute";
import AuthState from "./context/auth/AuthState";
import AlertState from "./context/alert/AlertState";
import ListState from "./context/list/ListState";
import setAuthToken from "./utils/setAuthToken";

import "./App.css";

library.add(
  faGithub,
  faEnvelopeOpen,
  faPhone,
  faInfoCircle,
  faTimesCircle,
  faSignOutAlt,
  faFileContract
);

localStorage.token && setAuthToken(localStorage.token);

const App: React.FC = () => (
  <AuthState>
    <AlertState>
      <ListState>
        <Router>
          <Navbar />
          <div className="container">
            <Alerts />
            <Switch>
              <PrivateRoute exact path="/" component={Home} />
              <Route exact path="/about" component={About} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              <Route component={NotFound} />
            </Switch>
          </div>
        </Router>
      </ListState>
    </AlertState>
  </AuthState>
);

export default App;
