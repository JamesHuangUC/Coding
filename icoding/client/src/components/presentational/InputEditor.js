import React from "react";
import { render } from "react-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import MonacoEditor from "react-monaco-editor";
import * as inputActions from "../../actions/inputActions";

class InputEditor extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     input: "// type your input..."
  //   };
  // }
  // editorDidMount(editor, monaco) {
  //   console.log("editorDidMount", editor);
  //   editor.focus();
  // }
  // onChange(newValue, e) {
  //   console.log("onChange input", newValue, e);
  // }

  passInput(input, e) {
    this.props.actions.passInput(input);
  }

  render() {
    // const input = this.props.input ? this.props.input : this.state.input;
    // const language = this.props.input ? "plaintext" : "javascript";
    const options = {
      selectOnLineNumbers: true
    };
    return (
      <MonacoEditor
        // value={code}
        language="plaintext"
        theme="vs-dark"
        options={options}
        onChange={this.passInput.bind(this)}
        // editorDidMount={::this.editorDidMount}
      />
    );
  }
}

// export default InputEditor;
// function mapStateToProps(state) {
//   return { input: state.input };
// }

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Object.assign(inputActions), dispatch)
  };
}

export default connect(
  // mapStateToProps,
  null,
  mapDispatchToProps
)(InputEditor);
