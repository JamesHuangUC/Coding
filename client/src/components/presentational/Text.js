import React from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import styles from "../../style/Text.css.js";

const Text = props => {
  return (
    <li style={styles.message}>
      <div style={styles.messageTitle}>
        <p style={{ textDecoration: "underline" }}>{props.message.from}</p>
        <span style={{ fontSize: "x-small" }}>{props.message.createdAt}</span>
      </div>
      <div>
        <p>{props.message.text}</p>
      </div>
    </li>
  );
};

export default Text;
