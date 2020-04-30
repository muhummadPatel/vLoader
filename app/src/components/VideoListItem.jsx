import React from "react";
import PropTypes from "prop-types";

class VideoListItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      url: props.video.url,
      loaded: false,
      done: false,
      thumbnail: null,
      title: "loading details...",
      size: null,
      progress: null,
    };

    this.startDownload = this.startDownload.bind(this);
    this.onRemoveVideoClicked = this.onRemoveVideoClicked.bind(this);
  }

  componentDidMount() {
    const { video } = this.props;

    window.api.videoUtils.getThumbnail(video.url, (file) => {
      this.setState((state) => {
        return {
          ...state,
          ...{
            loaded: true,
            thumbnail: file,
          },
        };
      }, this.startDownload());
    });
  }

  onRemoveVideoClicked() {
    const { onRemoveVideo } = this.props;
    const { url } = this.state;

    onRemoveVideo(url);
  }

  startDownload() {
    const { video } = this.props;
    const format = "best"; // TODO: get this from the user

    const onStart = ({ title, size }) => {
      this.setState((state) => {
        return { ...state, ...{ title, size } };
      });
    };
    const onProgress = ({ progress }) => {
      this.setState((state) => {
        return { ...state, ...{ progress } };
      });
    };
    const onDone = () => {
      this.setState((state) => {
        return { ...state, ...{ done: true } };
      });
    };
    window.api.videoUtils.download(
      video.url,
      format,
      onStart,
      onProgress,
      onDone
    );
  }

  render() {
    const { loaded, done, thumbnail, title, progress } = this.state;

    return (
      <div className="columns is-vcentered">
        <div className="column is-narrow">
          <figure
            className={`image is-thumbnail is-128x128
              ${loaded ? "" : "is-loading"}`}
          >
            <img src={thumbnail} alt="" />
          </figure>
        </div>

        <div className="column has-min-width-0">
          <div className="hover-scroll-x">
            <p className="is-size-6">{title}</p>
          </div>
          <progress
            className="progress is-large is-primary is-marginless"
            max="100"
            value={progress}
          />
          <p
            className={`has-text-centered is-bold is-size-4
              ${progress ? "" : "is-hidden"}`}
          >
            {progress ? `${parseInt(progress, 10)}%` : "0%"}
          </p>
        </div>

        <div
          className={`column is-narrow is-pulled-right ${
            done ? "" : "is-hidden"
          }`}
        >
          <button
            type="button"
            className="delete is-large"
            onClick={this.onRemoveVideoClicked}
          >
            &nbsp;
          </button>
        </div>
      </div>
    );
  }
}

VideoListItem.propTypes = {
  video: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }).isRequired,
  onRemoveVideo: PropTypes.func.isRequired,
};

export default VideoListItem;
