import { combineReducers } from "redux";
import challenges from "./challengesReducer";
import currentUser from "./currentUserReducer";
import input from "./inputReducer";
import output from "./outputReducer";

const rootReducer = combineReducers({
  currentUser,
  challenges,
  input,
  output
});

export default rootReducer;
