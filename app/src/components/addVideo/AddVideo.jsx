import React from "react";

class AddVideo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      videoInput: "",
    };

    this.onChangeVideoInput = this.onChangeVideoInput.bind(this);
    this.onSubmitVideoInput = this.onSubmitVideoInput.bind(this);
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
  }

  render() {
    const { videoInput } = this.state;

    return (
      <div className="level">
        <form className="level-item" onSubmit={this.onSubmitVideoInput}>
          <div className="field has-addons">
            <div className="control">
              <input
                className="input is-medium"
                placeholder="Video link"
                value={videoInput}
                onChange={this.onChangeVideoInput}
              />
            </div>

            <div className="control">
              <input
                className="button is-medium is-primary is-outlined"
                type="submit"
                value="Download"
              />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default AddVideo;
