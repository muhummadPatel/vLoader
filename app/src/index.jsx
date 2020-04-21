import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import Root from "Core/root";
import store, { history } from "Redux/store/store";

ReactDOM.render(
  <Suspense fallback="loading">
    <Root store={store} history={history}></Root>
  </Suspense>,
  document.getElementById("target")
);
