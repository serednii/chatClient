import React from "react";
import AppRoutes from "./components/AppRoutes";
import { observer } from "mobx-react-lite";

const App = () => (
  <div className="container">
    <AppRoutes />
  </div>
);

export default observer(App);
