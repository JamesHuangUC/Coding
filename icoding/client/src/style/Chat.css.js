const container = {
    backgroundColor: "#272822",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    color: "#F8F8F2",
    fontSize: "smaller"
};

const text = {
    color: "#F8F8F2"
};

const messageContainer = {
    flexGrow: 1,
    overflowY: "scroll",
    listStyleType: "none",
    padding: 5
};

const messageInput = {
    display: "flex",
    flexShrink: 0
};

export default { container, text, messageContainer, messageInput };
