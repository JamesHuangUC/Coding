import React, { Component } from "react";
import InputEditor from "../presentational/InputEditor.js";
import Output from "../presentational/Output.js";
import Title from "../common/Title.js";
import styles from "../../style/InOut.css.js";

class InOut extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "// type your input code..."
    };
  }

  // remove below
  // onChange(newValue, e) {
  //   console.log("onChange input", newValue, e);
  // }

  render() {
    const input = this.state.input;
    const options = {
      selectOnLineNumbers: true
    };
    return (
      <div style={styles.container}>
        <div style={styles.input}>
          <Title title="Input" />
          <InputEditor />
        </div>
        <div style={styles.output}>
          <Title title="Output" />
          <Output />
        </div>
      </div>
    );
  }
}
export default InOut;
