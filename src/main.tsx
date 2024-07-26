import React from "react";
import ReactDOM from "react-dom/client";

import "@radix-ui/themes/styles.css";
import "./main.css";

import { Theme } from "@radix-ui/themes";
import { Route, Switch } from "wouter";

import Index from "./routes/index";
import Login from "./routes/login";
import Import from "./routes/import";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Theme>
      <Switch>
        <Route path="/">
          <Index />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/import">
          <Import />
        </Route>
      </Switch>
    </Theme>
  </React.StrictMode>
);
