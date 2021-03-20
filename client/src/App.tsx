import React, { FC } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import {
  faDownload,
  faEnvelopeOpen,
  faExclamationCircle,
  faPhone,
  faBars,
  faInfoCircle,
  faTimesCircle,
  faSignOutAlt,
  faListUl,
  faTimes,
  faSortUp,
  faMoon,
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
  faDownload,
  faGithub,
  faEnvelopeOpen,
  faExclamationCircle,
  faPhone,
  faBars,
  faInfoCircle,
  faTimesCircle,
  faSignOutAlt,
  faListUl,
  faTimes,
  faSortUp,
  faMoon
);

const token = localStorage.token;
token && setAuthToken(token);

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
                {/* <Route component={NotFound} /> */}
                <Route path="*">
                  <Redirect to="/" />
                </Route>
              </Switch>
            </Router>
          </AuthState>
        </ItemState>
      </ListState>
    </AlertState>
  </AppState>
);

export default App;
