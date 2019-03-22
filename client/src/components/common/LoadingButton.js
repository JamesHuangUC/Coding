import React from "react";
import axios from "axios";
import qs from "qs";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Button } from "react-bootstrap";
import * as outputActions from "../../actions/outputActions";

function simulateNetworkRequest() {
  return new Promise(resolve => setTimeout(resolve, 2000));
}

function createQueryParameters(type = "Request") {
  var parameters = [];
  parameters.push("wait=true");
  var queryParameters = "?";
  for (var i = 0; i < parameters.length - 1; i++) {
    queryParameters += parameters[i] + "&";
  }
  return queryParameters + parameters[parameters.length - 1];
}

function getResult(code, language, input, passOutput) {
  let languageId = 29;
  let codeTemplate;
  switch (language) {
    case "javascript":
      languageId = 29;
      codeTemplate = 'console.log("Hello World");';
      break;
    case "shell":
      languageId = 1;
      codeTemplate = 'echo "Hello World"';
      break;
    case "c":
      languageId = 4;
      codeTemplate =
        '#include <stdio.h>\r\n\r\nint main(void) {\r\n    printf("Hello World\\n");\r\n    return 0;\r\n}';
      break;
    case "cpp":
      languageId = 10;
      codeTemplate =
        '#include <iostream>\r\n\r\nint main() {\r\n    std::cout << "Hello World" << std::endl;\r\n    return 0;\r\n}';
      break;
    case "csharp":
      languageId = 16;
      codeTemplate =
        'public class Hello {\r\n    public static void Main() {\r\n        System.Console.WriteLine("Hello World");\r\n    }\r\n}';
      break;
    case "go":
      languageId = 22;
      codeTemplate =
        'package main\r\n\r\nimport "fmt"\r\n\r\nfunc main() {\r\n    fmt.Println("Hello World")\r\n}';
      break;
    case "haskell":
      languageId = 23;
      codeTemplate = 'main = putStrLn "Hello World"';
      break;
    case "java":
      languageId = 26;
      codeTemplate =
        'public class Main {\r\n    public static void main(String[] args) {\r\n        System.out.println("Hello World");\r\n    }\r\n}';
      break;
    case "ocaml":
      languageId = 31;
      codeTemplate = 'print_endline "Hello World";;';
      break;
    case "pascal":
      languageId = 33;
      codeTemplate =
        "program Hello;\r\nbegin\r\n    writeln ('Hello World')\r\nend.";
      break;
    case "plainText":
      languageId = 43;
      codeTemplate = "Hello World";
      break;
    case "python":
      languageId = 34;
      codeTemplate = 'print("Hello World")';
      break;
    case "ruby":
      languageId = 38;
      codeTemplate = 'puts "Hello World"';
      break;
    default:
      languageId = 43; //PlainText
      codeTemplate = "Hello World";
      break;
  }

  const data = {
    source_code: code,
    language_id: languageId,
    stdin: input
  };

  if (data.source_code.trim() === "") {
    alert("Ready to code");
    return Promise.resolve();
  }
  const apiUrl = process.env.API_CODING;
  const wait = true;
  const queryParameters = createQueryParameters();

  const config = {
    headers: {
      accept: "application/json"
    },
    data: {}
  };

  return axios
    .post(`${apiUrl}/submissions${queryParameters}`, qs.stringify(data), config)
    .then(function(response) {
      // console.log(response);
      passOutput(response.data);
    })
    .catch(function(error) {
      console.log(error);
    });
}

class LoadingButton extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleClick = this.handleClick.bind(this);

    this.state = {
      isLoading: false
    };
  }

  handleClick() {
    this.setState({ isLoading: true }, () => {
      // simulateNetworkRequest().then(() => {
      //   this.setState({ isLoading: false });
      // });

      getResult(
        this.props.code,
        this.props.language,
        this.props.input,
        this.props.actions.passOutput
      ).then(() => {
        this.setState({ isLoading: false });
      });
    });
  }

  render() {
    const { isLoading } = this.state;

    return (
      <Button
        variant="secondary"
        disabled={isLoading}
        onClick={!isLoading ? this.handleClick : null}
      >
        {isLoading ? "Loading…" : this.props.children}
      </Button>
    );
  }
}

function mapStateToProps(state) {
  return { input: state.input };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Object.assign(outputActions), dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoadingButton);

// export default LoadingButton;
