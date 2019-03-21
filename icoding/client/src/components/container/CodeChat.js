import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from "../../style/CodeChat.css.js";

class CodeChat extends Component {
  static propTypes = {
    chat: PropTypes.node,
    children: PropTypes.node
  };

  render() {
    const { chat, children } = this.props;

    return (
      <div style={styles.container}>
        <div style={styles.leftPanel}>{children}</div>
        <div style={styles.rightPanel}>{chat}</div>
      </div>
    );
  }
}

export default CodeChat;
