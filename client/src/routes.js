import React from "react";
import { Route } from "react-router-dom";
import App from "./components/App";
import HomePage from "./components/container/HomePage";
import Room from "./components/container/Room";

export default (
    <App>
        <Route exact path="/" component={HomePage} />
        <Route path="/rooms/:id" component={Room} />
    </App>
);
