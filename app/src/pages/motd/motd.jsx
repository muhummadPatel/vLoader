import React from "react";
import { connect } from "react-redux";
import { changeMessage } from "Redux/components/home/homeSlice";
import { writeConfigRequest } from "secure-electron-store";
import PropTypes from "prop-types";
import "./motd.css";

class Motd extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: "",
    };

    this.onChangeMessage = this.onChangeMessage.bind(this);
    this.onSubmitMessage = this.onSubmitMessage.bind(this);
  }

  onChangeMessage(event) {
    const { value } = event.target;
    this.setState((state) => {
      return { ...state, ...{ message: value } };
    });
  }

  onSubmitMessage(event) {
    event.preventDefault(); // prevent navigation

    // eslint-disable-next-line no-shadow
    const { changeMessage } = this.props;
    const { message } = this.state;
    changeMessage(message); // update redux store
    window.api.store.send(writeConfigRequest, "motd", message); // save message to store (persist)

    // reset
    this.setState(() => {
      return { message: "" };
    });
  }

  render() {
    const { home } = this.props;
    const { message } = this.state;
    return (
      <div id="motd">
        <div className="motd">{home.message}</div>
        <div>
          <form onSubmit={this.onSubmitMessage}>
            <input
              placeholder="New message of the day"
              value={message}
              onChange={this.onChangeMessage}
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

const mapStateToProps = (state) => ({
  home: state.home,
});
const mapDispatch = { changeMessage };

Motd.propTypes = {
  home: PropTypes.shape({
    message: PropTypes.string.isRequired,
  }).isRequired,
  changeMessage: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatch)(Motd);
