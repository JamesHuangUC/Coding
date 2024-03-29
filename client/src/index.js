import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
// import { HashRouter as Router } from "react-router-dom";

// import './index.css';
import routes from "./routes";
import configureStore from "./store/configureStore";

// import * as serviceWorker from './serviceWorker';

const store = configureStore();

ReactDOM.render(
    <Provider store={store}>
        {/*<Router>{routes}</Router>*/}
        <Router basename={"/coding"}>{routes}</Router>
    </Provider>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
