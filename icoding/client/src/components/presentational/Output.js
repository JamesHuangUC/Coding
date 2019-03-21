import React, { PureComponent } from "react";
import { connect } from "react-redux";

function showOutput(data) {
    var outputText = "";
    var finishTime = new Date().toLocaleString();
    if (data.compile_output && data.stdout === null) {
        outputText =
            '<pre><span style="color: #FF0000">' +
            data.compile_output +
            "</span></pre>";
    } else if (data.stdout !== null && data.stderr !== null) {
        outputText =
            "<pre>" +
            '<span style="color: #F8F8F2">' +
            data.stdout +
            "</span>" +
            '<span style="color: #FF0000">' +
            data.stderr +
            "</span></pre>" +
            "<p>Run time: " +
            data.time +
            "sec</p>";
    } else if (data.stderr === null) {
        outputText =
            "<pre>" +
            '<span style="color: #F8F8F2">' +
            data.stdout +
            "</span></pre>" +
            "<p>Run time: " +
            data.time +
            "sec</p>";
    } else {
        outputText =
            '<pre><span style="color: #FF0000">' +
            data.stderr +
            "</span></pre>" +
            "<p>Run time: " +
            data.time +
            "sec</p>";
    }
    return outputText;
}

class Output extends PureComponent {
    render() {
        const output = this.props.output;
        if (output === "") {
            return <div />;
        } else {
            const outputHtml = showOutput(output);
            return <div dangerouslySetInnerHTML={{ __html: outputHtml }} />;
        }
    }
}

function mapStateToProps(state) {
    return { output: state.output };
}

export default connect(mapStateToProps)(Output);
