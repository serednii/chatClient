import React from "react";
import AppRoutes from "./components/AppRoutes";
import { observer } from "mobx-react-lite";
import Info from "./info/info";

const App = () => (
  <div className="container">
    <Info />
    <AppRoutes />
  </div>
);

export default observer(App);
