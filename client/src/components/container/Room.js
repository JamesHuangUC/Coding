import React from "react";
import MonacoEditor from "react-monaco-editor";
// import CodeMirror from "@skidding/react-codemirror";
import faker from "faker";
import moment from "moment";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Button } from "react-bootstrap";

import Header from "../presentational/Header";
import CodeChat from "./CodeChat.js";
import Title from "../common/Title.js";
import Chat from "../presentational/Chat.js";
import InOut from "./InOut.js";
// import ThemeSelect from "../presentational/ThemeSelect";
// import UserList from "../presentational/UserList";
// import SaveButton from "../presentational/SaveButton";

import * as actions from "../../actions/challengesActions";

// import "codemirror/lib/codemirror.css";
// import "codemirror/theme/monokai.css";
// import "codemirror/theme/bespin.css";
// import "codemirror/theme/3024-day.css";
// import "codemirror/theme/3024-night.css";
// import "codemirror/theme/cobalt.css";
// import "codemirror/theme/eclipse.css";
// import "codemirror/theme/dracula.css";
// import "codemirror/theme/isotope.css";
// import "codemirror/theme/duotone-light.css";
// import "codemirror/theme/icecoder.css";
// import "codemirror/theme/material.css";
// import "codemirror/theme/midnight.css";
// import "codemirror/theme/solarized.css";

// import "codemirror/mode/javascript/javascript.js";
// import "codemirror/mode/ruby/ruby.js";
// import "codemirror/mode/swift/swift.js";
// import "codemirror/mode/clojure/clojure.js";
// import "codemirror/mode/python/python.js";
// import "codemirror/mode/php/php.js";
// import "codemirror/mode/erlang/erlang.js";
// import "codemirror/mode/coffeescript/coffeescript.js";
// import "codemirror/mode/crystal/crystal.js";

import { listen, MessageConnection } from "vscode-ws-jsonrpc";
import {
  BaseLanguageClient,
  CloseAction,
  ErrorAction,
  createMonacoServices,
  createConnection
} from "monaco-languageclient";
import ReconnectingWebSocket from "reconnecting-websocket";

import io from "socket.io-client";

var socket = io.connect(process.env.API_HOST);

var contentWidgets = {}; // Save monaco editor name contentWidgets
var myeditor;
var decorations = {}; // Save monaco editor cursor or selection decorations
var users = {}; // User
var issocket = false; // Avoid conflict between editor change event and socket change event
var myRoomId;

class Room extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: "",
      language: "javascript",
      theme: "vs-dark",
      users: [],
      currentlyTyping: null,
      messages: []
    };
    socket.on("receive code", payload => this.updateCodeInState(payload));
    socket.on("receive change language", newLanguage =>
      this.updateLanguageInState(newLanguage)
    );
    socket.on("new user join", users => this.joinUser(users));
    socket.on("load users and code", () => this.sendUsersAndCode());
    socket.on("receive users and code", payload =>
      this.updateUsersAndCodeInState(payload)
    );
    socket.on("user left room", user => this.removeUser(user));
    socket.on("toClientMessage", msg => this.getMessage(msg));


    // added socket event for cursor and selection sync
    socket.on("userdata", data => {
      for (var i of data) {
        users[i.user] = i.color;
        this.insertCSS(i.user, i.color);
        this.insertWidget(i);
        decorations[i.user] = [];
      }
    });

    socket.on("connected user and color", data => {
      this.insertCSS(data.user, data.color);
      this.insertWidget(data);
      decorations[data.user] = [];
      socket.emit("filedata", {
        code: myeditor.getValue(),
        room: this.props.match.params.id
      });
    });

    socket.on("exit", function(data) {
      //Other User Exit Event
      myeditor.removeContentWidget(contentWidgets[data]);
      myeditor.deltaDecorations(decorations[data], []);
      delete decorations[data];
      delete contentWidgets[data];
    });

    socket.on("key", data => {
      //Change Content Event
      issocket = true;
      this.changeText(data);
    });

    socket.on("resetdata", function(data) {
      //get code from other room
      issocket = true;
      myeditor.setValue(data);
      issocket = false;
    });

    socket.on("selection", data => {
      //change Selection Event
      this.changeSeleciton(data);
      this.changeWidgetPosition(data);
    });

    // remove user when page about to unload
    this.onUnload = this.onUnload.bind(this);
  }

  editorDidMount(editor, monaco) {
    myeditor = editor;
  }  

  componentDidMount() {
    const user = sessionStorage.currentUser || this.props.currentUser;
    const roomId = this.props.match.params.id;
    sessionStorage.setItem("currentUser", user);
    const users = [...this.state.users, user];
    socket.emit("room", { room: roomId, user: user });
    this.setState({ users: users });

    // if (typeof this.props.challenge.id === "undefined") {
    //   this.props.actions.getChallenges();
    // } else {
    //   const user = this.props.currentUser;
    //   sessionStorage.setItem("currentUser", user);
    //   const users = [...this.state.users, this.props.currentUser];
    //   socket.emit("room", { room: this.props.challenge.id, user: user });
    //   this.setState({ users: users });
    // }

    window.addEventListener("beforeunload", this.onUnload);

    myRoomId = this.props.match.params.id;
    myeditor.onDidChangeCursorSelection(function(e) {
      e.room = roomId;
      e.user = user;
      socket.emit("selection", e);
    });

    myeditor.onDidChangeModelContent(function(e) {
        //Text Change
        e.room = myRoomId;
        if (issocket == false) {
            socket.emit("key", e);
        } else issocket = false;
    });
  }

  componentWillUnmount() {
    // socket.emit("leave room", {
    //   // room: this.props.challenge.id,
    //   room: this.props.match.params.id,
    //   user: this.props.currentUser
    // });
    // this.removeUser(this.props.currentUser);

    window.removeEventListener("beforeunload", this.onUnload);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const user = sessionStorage.currentUser || nextProps.currentUser;
    sessionStorage.setItem("currentUser", user);
    const users = [...this.state.users, user];
    socket.emit("room", { room: this.props.match.params.id, user: user });
    this.setState({ users: users });
  }

  // Need to replace UNSAFE_componentWillReceiveProps, when user arrives on rooms directly or refresh, user should get back the code they already typed or the same code that other user who are in the same room typed.
  // static getDerivedStateFromProps(nextProps, prevState) {
  //   if (
  //     typeof nextProps.challenge.id !== "undefined" &&
  //     typeof prevState.users === "undefined"
  //   ) {
  //     const user = nextProps.currentUser;
  //     const users = [...prevState.users, user];
  //     socket.emit("room", { room: nextProps.challenge.id, user: user });
  //     return { users };
  //   }
  //   return null;
  // }

  sendUsersAndCode() {
    socket.emit("send users and code", {
      // room: this.props.challenge.id,
      room: this.props.match.params.id,
      users: this.state.users,
      code: this.state.code
    });
  }

  removeUser(user) {
    const newUsers = Object.assign([], this.state.users);
    const indexOfUserToDelete = this.state.users.findIndex(Olduser => {
      return Olduser === user.user;
    });
    newUsers.splice(indexOfUserToDelete, 1);
    this.setState({ users: newUsers });
  }

  joinUser(user) {
    const combinedUsers = [...this.state.users, user];
    const newUsers = Array.from(new Set(combinedUsers));
    const cleanUsers = newUsers.filter(user => {
      return user.length > 1;
    });
    this.setState({ users: cleanUsers });
  }

  updateCodeInState(payload) {
    this.setState({
      code: payload.code,
      currentlyTyping: payload.currentlyTyping
    });
  }

  updateCodeForCurrentUser(newCode) {
    this.setState({
      code: newCode
    });
  }

  updateLanguageInState(newLanguage) {
    this.setState({
      language: newLanguage
    });
  }

  updateUsersAndCodeInState(payload) {
    const combinedUsers = this.state.users.concat(payload.users);
    const newUsers = Array.from(new Set(combinedUsers));
    const cleanUsers = newUsers.filter(user => {
      return user.length > 1;
    });
    this.setState({ users: cleanUsers, code: payload.code });
  }

  codeIsHappening(newCode) {
    this.updateCodeForCurrentUser(newCode);
    this.updateCurrentlyTyping();
    socket.emit("coding event", {
      code: newCode,
      // room: this.props.challenge.id,
      room: this.props.match.params.id,
      currentlyTyping: this.props.currentUser
    });
  }

  updateCurrentlyTyping() {
    this.setState({ currentlyTyping: this.props.currentUser });
  }

  changeLanguage(newLanguage) {
    this.updateLanguageInState(newLanguage);
    // socket.emit("change mode", {
    //   mode: newMode,
    //   room: this.props.challenge.id
    // });
  }

  changeTheme(newTheme) {
    this.setState({ theme: newTheme });
  }

  clearCode(e) {
    e.preventDefault();
    this.setState({ code: "" });
    socket.emit("coding event", { code: "", room: this.props.challenge.id });
  }

  getMessage(msg) {
    var formattedTime = moment(msg.createdAt).format("h:mm a");
    var message = {
      from: msg.from,
      text: msg.text,
      createdAt: formattedTime
    };
    // console.log(message);
    this.setState({ messages: [...this.state.messages, message] });
  }


  // ----------- cursor and selection sync ----------
  onUnload(event) {
    socket.emit("leave room", {
      room: this.props.match.params.id,
      user: this.props.currentUser
    });
    this.removeUser(this.props.currentUser);
    event.returnValue = "Hello";
  }

  insertCSS(id, color) {
    var style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML += "." + id + " { background-color:" + color + "}\n"; //Selection Design
    style.innerHTML += `
    .${id}one { 
        background: ${color};
        width:2px !important 
    }`; //cursor Design
    document.getElementsByTagName("head")[0].appendChild(style);
  }

  insertWidget(e) {
    contentWidgets[e.user] = {
      domNode: null,
      position: {
        lineNumber: 0,
        column: 0
      },
      getId: function() {
        return "content." + e.user;
      },
      getDomNode: function() {
        if (!this.domNode) {
          this.domNode = document.createElement("div");
          this.domNode.innerHTML = e.user;
          this.domNode.style.background = e.color;
          this.domNode.style.color = "black";
          this.domNode.style.opacity = 0.8;
          this.domNode.style.width = "max-content";
        }
        return this.domNode;
      },
      getPosition: function() {
        return {
          position: this.position,
          preference: [
            monaco.editor.ContentWidgetPositionPreference.ABOVE,
            monaco.editor.ContentWidgetPositionPreference.BELOW
          ]
        };
      }
    };
  }

  changeWidgetPosition(e) {
    contentWidgets[e.user].position.lineNumber = e.selection.endLineNumber;
    contentWidgets[e.user].position.column = e.selection.endColumn;

    myeditor.removeContentWidget(contentWidgets[e.user]);
    myeditor.addContentWidget(contentWidgets[e.user]);
  }

  changeSeleciton(e) {
    var selectionArray = [];
    if (
      e.selection.startColumn == e.selection.endColumn &&
      e.selection.startLineNumber == e.selection.endLineNumber
    ) {
      //if cursor
      e.selection.endColumn++;
      selectionArray.push({
        range: e.selection,
        options: {
          className: `${e.user}one`,
          hoverMessage: {
            value: e.user
          }
        }
      });
    } else {
      //if selection
      selectionArray.push({
        range: e.selection,
        options: {
          className: e.user,
          hoverMessage: {
            value: e.user
          }
        }
      });
    }
    for (let data of e.secondarySelections) {
      //if select multi
      if (
        data.startColumn == data.endColumn &&
        data.startLineNumber == data.endLineNumber
      ) {
        selectionArray.push({
          range: data,
          options: {
            className: `${e.user}one`,
            hoverMessage: {
              value: e.user
            }
          }
        });
      } else
        selectionArray.push({
          range: data,
          options: {
            className: e.user,
            hoverMessage: {
              value: e.user
            }
          }
        });
    }
    decorations[e.user] = myeditor.deltaDecorations(
      decorations[e.user],
      selectionArray
    ); //apply change
  }

  changeText(e) {
    myeditor.getModel().applyEdits(e.changes); //Update code
  }

  // ----------- end cursor and selection sync ------


  //--------------------------------- did update --------------------------------------------------
  componentDidUpdate(prevProps, prevState) {
    if (prevState.language !== this.state.language) {
      // console.log(prevState.language);
      // console.log(this.state.language);
      myeditor.setModel();

      let indexModel;
      if (this.state.language === "java") {
        if (
          monaco.editor.getModel(
            monaco.Uri.parse(
              // `file:///Users/zhuang/eclipse-workspace/Test001/src/Main.java`
              `file:///app/workspace/jdt.ls-java-project/src/Main.java`
            )
          )
        ) {
          monaco.editor
            .getModel(
              monaco.Uri.parse(
                // `file:///Users/zhuang/eclipse-workspace/Test001/src/Main.java`
                `file:///app/workspace/jdt.ls-java-project/src/Main.java`
              )
            )
            .dispose();
        }
        indexModel = monaco.editor.createModel(
          this.state.code,
          undefined,
          monaco.Uri.parse(
            // `file:///Users/zhuang/eclipse-workspace/Test001/src/Main.java`
            `file:///app/workspace/jdt.ls-java-project/src/Main.java`
          )
        );
      } else if (this.state.language === "c") {
        indexModel = monaco.editor.createModel(
          this.state.code,
          undefined,
          monaco.Uri.parse(
            // `file:///Users/zhuang/eclipse-workspace/Test001/src/Main-${new Date().getTime()}.c`
            `file:///app/workspace/jdt.ls-java-project/src/Main-${new Date().getTime()}.c`
          )
        );
      } else if (this.state.language === "cpp") {
        indexModel = monaco.editor.createModel(
          this.state.code,
          undefined,
          monaco.Uri.parse(
            // `file:///Users/zhuang/eclipse-workspace/Test001/src/Main-${new Date().getTime()}.cpp`
            `file:///app/workspace/jdt.ls-java-project/src/Main-${new Date().getTime()}.cpp`
          )
        );
      } else if (this.state.language === "python") {
        indexModel = monaco.editor.createModel(
          this.state.code,
          undefined,
          monaco.Uri.parse(
            // `file:///Users/zhuang/eclipse-workspace/Test001/src/Main-${new Date().getTime()}.py`
            `file:///app/workspace/jdt.ls-java-project/src/Main-${new Date().getTime()}.py`
          )
        );
      } else {
        indexModel = monaco.editor.createModel(
          this.state.code,
          undefined,
          monaco.Uri.parse(
            // `file:///Users/zhuang/eclipse-workspace/Test001/src/Main-${new Date().getTime()}.js`
            `file:///app/workspace/jdt.ls-java-project/src/Main-${new Date().getTime()}.js`
            // `inmemory://model.json`
          )
        );
      }
      myeditor.setModel(indexModel);

      let services;
      if (this.state.language === "java") {
        services = createMonacoServices(myeditor, {
          // rootUri: "file:///Users/zhuang/Desktop"
          rootUri: "file:///app/workspace"
        });
      } else {
        services = createMonacoServices(myeditor, {
          rootUri: "file:///app/workspace"
          // rootUri: "file:///Users/zhuang/Desktop"
        });
      }

      listen({
        webSocket: new ReconnectingWebSocket(this.createUrl.bind(this)),
        onConnection: connection => {
          const languageClient = this.createLanguageClient(
            connection,
            services
          );
          const disposable = languageClient.start();
          connection.onClose(() => disposable.dispose());
        }
      });
    }
  }
  //--------------------------------- end did update ----------------------------------------------

  //--------------------------------- connect websocket -------------------------------------------
  createUrl() {
    switch (this.state.language) {
      case "java":
        // return "ws://localhost:3001/sampleServer";
        return "wss://java-coding.herokuapp.com/sampleServer";
      case "c":
        return "wss://cpp-coding.herokuapp.com/sampleServer";
      // return "ws://localhost:3000/sampleServer";
      case "cpp":
        return "wss://cpp-coding.herokuapp.com/sampleServer";
      // return "ws://localhost:3000/sampleServer";
      case "python":
        return "wss://python-coding.herokuapp.com/sampleServer";
      // return "ws://localhost:3000/sampleServer";
      case "javascript":
        return "wss://javascript/coding";
    }
  }

  createLanguageClient(connection, services) {
    return new BaseLanguageClient({
      name: `JSON Client`,
      clientOptions: {
        documentSelector: [this.state.language],
        errorHandler: {
          error: () => ErrorAction.Continue,
          closed: () => CloseAction.DoNotRestart
        }
      },
      services,
      // create a language client connection from the JSON RPC connection on demand
      connectionProvider: {
        get: (errorHandler, closeHandler) => {
          return Promise.resolve(
            createConnection(connection, errorHandler, closeHandler)
          );
        }
      }
    });
  }

  createWebSocket(socketUrl) {
    const socketOptions = {
      maxReconnectionDelay: 10000,
      minReconnectionDelay: 1000,
      reconnectionDelayGrowFactor: 1.3,
      connectionTimeout: 10000,
      maxRetries: Infinity,
      debug: false
    };
    return new ReconnectingWebSocket(socketUrl, undefined, socketOptions);
  }
  //--------------------------------- end connect websocket ---------------------------------------


  render() {
    var options = {
      selectOnLineNumbers: true
      // lineNumbers: true,
      // mode: this.state.mode,
      // theme: this.state.theme
    };
    return (
      <div style={{ height: "100vh" }}>
        <Header
          language={this.state.language}
          code={this.state.code}
          changeLanguage={this.changeLanguage.bind(this)}
        />

        <CodeChat
          chat={
            <Chat
              room={this.props.match.params.id}
              currentUser={this.props.currentUser}
              messages={this.state.messages}
            />
          }
        >
          <Title title="Main" />
          <MonacoEditor
            // height="600"
            language={this.state.language}
            theme={this.state.theme}
            // value={this.state.code}
            options={options}
            onChange={this.codeIsHappening.bind(this)}
            editorDidMount={this.editorDidMount.bind(this)}
            ref="monaco"
          />
        </CodeChat>
        <InOut />

        {/*        <h1>{this.props.challenge.title}</h1>
        <p>{this.props.challenge.description}</p>
        <UserList
          users={this.state.users}
          currentlyTyping={this.state.currentlyTyping}
        />
        <ThemeSelect
          theme={this.state.theme}
          changeTheme={this.changeTheme.bind(this)}
        />

        <CodeMirror
          value={this.state.code}
          onChange={this.codeIsHappening.bind(this)}
          options={options}
        />
      */}

        {/*<MonacoEditor
          // width="800"
          height="600"
          // language="javascript"
          language={this.state.mode}
          theme={this.state.theme}
          value={this.state.code}
          options={options}
          // onChange={::this.onChange}
          // editorDidMount={::this.editorDidMount}

          onChange={this.codeIsHappening.bind(this)}
        />

        <br />
        <SaveButton
          text={this.state.code}
          lang={this.state.mode}
          title={this.props.challenge.title}
        />
        <br />
        <Button onClick={this.clearCode.bind(this)} className="col-lg-12">
          clear code
        </Button>
        */}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  if (state.challenges.length > 0) {
    const challenge = state.challenges.filter(challenge => {
      return challenge.id === parseInt(ownProps.match.params.id);
    })[0];
    const userName = sessionStorage.currentUser || state.currentUser;
    return { challenge: challenge, currentUser: userName };
  } else {
    return {
      challenge: { title: "", description: "", source: "" },
      // currentUser: ""
      currentUser: sessionStorage.currentUser || faker.internet.userName()
    };
  }
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Room);
