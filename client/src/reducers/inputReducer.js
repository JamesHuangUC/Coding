import initialState from "./initialState";

export default function inputReducer(state = initialState.input, action) {
  switch (action.type) {
    case "PASS_INPUT":
      return action.payload;
    default:
      return state;
  }
}
