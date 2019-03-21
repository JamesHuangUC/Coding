import React from "react";
import { Navbar, Nav, Form } from "react-bootstrap";
import LoadingButton from "../common/LoadingButton.js";

const Header = props => {
  function triggerChangeLanguage(e) {
    props.changeLanguage(e.target.value);
  }

  function renderLanguageSelect() {
    // const language = [
    //   "javascript",
    //   "c",
    //   "cpp",
    //   "csharp",
    //   "go",
    //   "haskel",
    //   "java",
    //   "ocaml",
    //   "pascal",
    //   "ruby",
    //   "plaintext",
    //   "python"
    // ];

    const languages = {
      shell: "Bash",
      c: "C",
      cpp: "C++",
      csharp: "C#",
      go: "Go",
      haskel: "Haskell",
      java: "Java",
      javascript: "Javascript",
      ocaml: "Ocaml",
      pascal: "Pascal",
      ruby: "Ruby",
      plaintext: "PlainText",
      python: "Python"
    };

    return (
      // <select value={props.language} onChange={triggerChangeLanguage}>
      // {
      Object.keys(languages).map((language, i) => (
        <option key={i} value={language}>
          {languages[language]}
        </option>
      ))
      // }
      // </select>
    );

    // return language.map((language, i) => {
    //   if (language === props.language) {
    //     return (
    //       <option key={i} value={language}>
    //         {language}
    //       </option>
    //     );
    //   } else {
    //     return (
    //       <option key={i} value={language}>
    //         {language}
    //       </option>
    //     );
    //   }
    // });
  }
  return (
    <Navbar bg="dark" variant="dark" style={{height: "5vh"}}>
      {/*<Navbar.Brand href="/">Coding</Navbar.Brand>*/}
      <Navbar.Brand href="/coding">Coding</Navbar.Brand>

      <Navbar.Collapse className="justify-content-end">
        <LoadingButton language={props.language} code={props.code}>
          Execute
        </LoadingButton>
        <Form inline>
          <Form.Group
            controlId="formControlsSelect"
            // onChange={triggerChangeLanguage}
          >
            {/*<Form.Label>change language</Form.Label>*/}
            <Form.Control
              as="select"
              value={props.language}
              onChange={triggerChangeLanguage}
            >
              {renderLanguageSelect()}
            </Form.Control>
          </Form.Group>
        </Form>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
