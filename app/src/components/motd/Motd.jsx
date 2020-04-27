import React from "react";
import PropTypes from "prop-types";

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
      <div className="container">
        <div className="level">
          <p className="level-item">{motd}</p>
        </div>
        <div className="level">
          <form className="level-item" onSubmit={this.onSubmitMessageInput}>
            <input
              className="input"
              placeholder="New message of the day"
              value={messageInput}
              onChange={this.onChangeMessageInput}
            />
            <input className="button" type="submit" value="Save" />
          </form>
        </div>
        <div className="level">
          <p className="level-item">
            Your message of the day will persist if you close and re-open the
            app.
          </p>
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
