import faker from "faker";
const initialState = {
  challenges: [],
  currentUser: faker.internet.userName(),
  input: "",
  output: ""
};

export default initialState;
