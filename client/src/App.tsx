import React, { FC } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import {
  faEnvelopeOpen,
  faExclamationCircle,
  faPhone,
  faBars,
  faInfoCircle,
  faTimesCircle,
  faSignOutAlt,
  faListUl,
} from "@fortawesome/free-solid-svg-icons";

import Navbar from "./components/layout/Navbar";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Alerts from "./components/layout/Alerts";
import Home from "./components/pages/Home";
import About from "./components/pages/About";
import NotFound from "./components/pages/NotFound";
import PrivateRoute from "./components/routing/PrivateRoute";

import AppState from "./context/app/AppState";
import AuthState from "./context/auth/AuthState";
import AlertState from "./context/alert/AlertState";
import ListState from "./context/list/ListState";
import ItemState from "./context/item/ItemState";
import setAuthToken from "./utils/setAuthToken";

import "./App.css";

library.add(
  faGithub,
  faEnvelopeOpen,
  faExclamationCircle,
  faPhone,
  faBars,
  faInfoCircle,
  faTimesCircle,
  faSignOutAlt,
  faListUl
);

localStorage.token && setAuthToken(localStorage.token);

const App: FC = () => (
  <AppState>
    <AlertState>
      <ListState>
        <ItemState>
          <AuthState>
            <Router>
              <Navbar title={"Listies"} icon={["fas", "list-ul"]} />
              <Alerts />
              <Switch>
                <PrivateRoute exact path="/" component={Home} />
                <Route exact path="/about" component={About} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/login" component={Login} />
                <Route component={NotFound} />
              </Switch>
            </Router>
          </AuthState>
        </ItemState>
      </ListState>
    </AlertState>
  </AppState>
);

export default App;
