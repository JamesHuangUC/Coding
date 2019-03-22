import React from "react";
import styles from "../../style/Title.css.js";

const Title = ({ title }) => (
    <div style={styles.container}>
        <span style={styles.text}>{title}</span>
    </div>
);

export default Title;
