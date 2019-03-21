import React from "react";
import io from "socket.io-client";

import Title from "../common/Title.js";
import Text from "./Text.js";
import styles from "../../style/Chat.css.js";

var socket = io.connect(process.env.API_HOST);

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: ""
    };
    this.messagesEnd = null;

    this.setMessagesEndRef = element => {
      this.messagesEnd = element;
    };
  }

  scrollToBottom() {
    if (this.messagesEnd) {
      this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  onChange(e) {
    this.setState({
      text: e.target.value
    });
  }

  onKeyUp(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (this.state.text.length) {
        this.setState({ text: "" });
        socket.emit("createMessage", {
          userName: this.props.currentUser,
          text: this.state.text,
          room: this.props.room
        });
      } else {
        // alert("Please enter a message");
      }
    }
  }

  render() {
    return (
      <div style={styles.container}>
        <Title title={`Room ${this.props.room}`} />

        <ol style={styles.messageContainer}>
          {this.props.messages.map((message, ind) => {
            return <Text message={message} key={ind} />;
          })}
          <div
            style={{ float: "left", clear: "both" }}
            ref={this.setMessagesEndRef}
            // ref={el => {
            //   this.messagesEnd = el;
            // }}
          />
        </ol>

        <input
          className="form-control"
          placeholder="Send a message"
          value={this.state.text}
          onChange={this.onChange.bind(this)}
          onKeyUp={this.onKeyUp.bind(this)}
          style={styles.messageInput}
        />
      </div>
    );
  }
}

export default Chat;
