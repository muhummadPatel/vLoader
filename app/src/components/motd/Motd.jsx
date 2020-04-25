import React from "react";
import PropTypes from "prop-types";
import "./motd.css";

class Motd extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messageInput: "",
    };

    this.onChangeMessageInput = this.onChangeMessageInput.bind(this);
    this.onSubmitMessageInput = this.onSubmitMessageInput.bind(this);
  }

  onChangeMessageInput(event) {
    const { value } = event.target;
    this.setState((state) => {
      return { ...state, ...{ messageInput: value } };
    });
  }

  onSubmitMessageInput(event) {
    event.preventDefault(); // prevent navigation

    const { updateMotd } = this.props;
    const { messageInput } = this.state;
    updateMotd(messageInput);

    // reset
    this.setState(() => {
      return { messageInput: "" };
    });
  }

  render() {
    const { motd } = this.props;
    const { messageInput } = this.state;

    return (
      <div id="motd">
        <div className="motd">{motd}</div>
        <div>
          <form onSubmit={this.onSubmitMessageInput}>
            <input
              placeholder="New message of the day"
              value={messageInput}
              onChange={this.onChangeMessageInput}
            />
            <input type="submit" value="Save" />
          </form>
          <div className="tip">
            Your message of the day will persist
            <br />
            if you close and re-open the app.
          </div>
        </div>
      </div>
    );
  }
}

Motd.propTypes = {
  motd: PropTypes.string.isRequired,
  updateMotd: PropTypes.func.isRequired,
};

export default Motd;
