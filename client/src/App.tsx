import { FC } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

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
import DarkMode from "./components/layout/DarkMode";
import DarkToggle from "./components/layout/DarkToggle";
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

const App: FC = () => (
  <AppState>
    <AlertState>
      <AuthState>
        <ListState>
          <ItemState>
            <Router>
              <DarkMode />
              <Navbar title={"Listies"} icon={["fas", "list-ul"]} />
              <DarkToggle />
              <Alerts />
              <Routes>
                <Route
                  path="/"
                  element={
                    <PrivateRoute redirectTo="/login">
                      <Home />
                    </PrivateRoute>
                  }
                />
                <Route path="/about" element={<About />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </ItemState>
        </ListState>
      </AuthState>
    </AlertState>
  </AppState>
);

export default App;
