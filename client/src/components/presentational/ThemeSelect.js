import React from "react";
import Form from "react-bootstrap/Form";

const ThemeSelect = props => {
  function triggerChangeTheme(e) {
    props.changeTheme(e.target.value);
  }

  function renderModeSelect() {
    const themes = [
      "eclipse",
      "monokai",
      "bespin",
      "3024-day",
      "3024-night",
      "cobalt",
      "dracula",
      "isotope",
      "duotone-light",
      "icecoder",
      "material",
      "midnight",
      "solarized"
    ];
    return themes.map((theme, i) => {
      if (theme === props.theme) {
        return (
          <option key={i} value={theme}>
            {theme}
          </option>
        );
      } else {
        return (
          <option key={i} value={theme}>
            {theme}
          </option>
        );
      }
    });
  }
  return (
    <Form>
      <Form.Group controlId="formControlsSelect" onChange={triggerChangeTheme}>
        <Form.Label>change theme</Form.Label>
        <Form.Control as="select">{renderModeSelect()}</Form.Control>
      </Form.Group>
    </Form>
  );
};

export default ThemeSelect;
