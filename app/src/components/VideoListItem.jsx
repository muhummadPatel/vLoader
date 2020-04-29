import React from "react";
import PropTypes from "prop-types";

class VideoListItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      thumbnail: null,
    };
  }

  componentDidMount() {
    const { video } = this.props;

    window.api.videoUtils.getThumbnail(video.url, (file) => {
      console.log(file);
      this.setState((state) => {
        return {
          ...state,
          ...{
            loaded: true,
            thumbnail: file,
          },
        };
      });
    });
  }

  render() {
    const { loaded, thumbnail } = this.state;
    const { video } = this.props;

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

        <div className="column">
          <p className="is-size-6">{video.url}</p>
          <progress
            className="progress is-large is-primary"
            max="100"
            // TODO: fix this to actually display progress once we start the download
            value={loaded ? 50 : null}
          />
        </div>

        <div className="column is-narrow is-pulled-right">
          <button type="button" className="button is-medium is-outlined">
            <span className="icon is-small">
              <i className="mdi mdi-24px mdi-close" />
            </span>
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
};

export default VideoListItem;
