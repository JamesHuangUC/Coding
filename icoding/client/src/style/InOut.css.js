const container = {
  display: "flex",
  // height: 200,
  // maxHeight: 200,
  height: "20vh",
  resize: "vertical",
  overflow: "auto"
};

const input = {
  display: "flex",
  flexDirection: "column",
  flex: 3
};

const output = {
  flex: 3,
  backgroundColor: "#272822",
  color: "#F8F8F2",
  overflowY: "scroll"
};

// const outputText = {
//     fontFamily: "menlo",
//     fontSize: "small"
// };

export default { container, input, output };
