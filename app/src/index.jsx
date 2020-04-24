import React from "react";
import ReactDOM from "react-dom";
import Motd from "Pages/motd/motd";
import store, { history } from "Redux/store/store";

ReactDOM.render(
  <Motd store={store} history={history} />,
  document.getElementById("target")
);
