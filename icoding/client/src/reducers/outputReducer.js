import initialState from "./initialState";

export default function outputReducer(state = initialState.output, action) {
  switch (action.type) {
    case "PASS_OUTPUT":
      return action.payload;
    default:
      return state;
  }
}
