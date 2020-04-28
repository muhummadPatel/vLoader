import React from "react";

class AddVideo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      videoInput: "",
    };
    this.videoInputNode = React.createRef();

    this.onChangeVideoInput = this.onChangeVideoInput.bind(this);
    this.onSubmitVideoInput = this.onSubmitVideoInput.bind(this);
  }

  componentDidMount() {
    // As soon as this component mounts, pull focus to the search bar
    this.videoInputNode.current.focus();
  }

  onChangeVideoInput(event) {
    const { value } = event.target;
    this.setState((state) => {
      return { ...state, ...{ videoInput: value } };
    });
  }

  onSubmitVideoInput(event) {
    event.preventDefault();

    const { videoInput } = this.state;
    console.log(`Submitted: ${videoInput}`);

    // reset the input text
    this.setState((state) => {
      return { ...state, ...{ videoInput: "" } };
    });
  }

  render() {
    const { videoInput } = this.state;

    return (
      <div className="level">
        <form className="level-item" onSubmit={this.onSubmitVideoInput}>
          <input
            className="input is-medium"
            placeholder="Video link"
            value={videoInput}
            onChange={this.onChangeVideoInput}
            ref={this.videoInputNode}
          />

          <input
            className="button is-medium is-primary is-outlined"
            type="submit"
            value="Download"
          />
        </form>
      </div>
    );
  }
}

export default AddVideo;