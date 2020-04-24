import { combineReducers } from "redux";
import homeReducer from "../components/home/homeSlice";

const createRootReducer = () =>
  combineReducers({
    home: homeReducer,
  });

export default createRootReducer;
