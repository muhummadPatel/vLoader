import { combineReducers } from "redux";
import undoable from "easy-redux-undo";
import homeReducer from "../components/home/homeSlice";

const createRootReducer = (history) =>
  combineReducers({
    home: homeReducer,
  });

export default createRootReducer;
