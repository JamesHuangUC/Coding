import React from "react";
import Form from "react-bootstrap/Form";

const ModeSelect = props => {
  function triggerChangeMode(e) {
    props.changeMode(e.target.value);
  }

  function renderModeSelect() {
    const modes = [
      "javascript",
      "ruby",
      "clojure",
      "coffeescript",
      "crystal",
      "erlang",
      "php",
      "python",
      "swift"
    ];

    return modes.map((mode, i) => {
      if (mode === props.mode) {
        return (
          <option key={i} value={mode}>
            {mode}
          </option>
        );
      } else {
        return (
          <option key={i} value={mode}>
            {mode}
          </option>
        );
      }
    });
  }
  return (
    <Form>
      <Form.Group controlId="formControlsSelect" onChange={triggerChangeMode}>
        <Form.Label>change language</Form.Label>
        <Form.Control as="select">{renderModeSelect()}</Form.Control>
      </Form.Group>
    </Form>
  );
};

export default ModeSelect;
