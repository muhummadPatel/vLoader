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

    let listItemContents;
    if (loaded) {
      listItemContents = (
        <div className="level">
          <div className="level-left">
            <figure className="level-item image is-thumbnail is-128x128">
              <img src={thumbnail} alt="video-thumbnail" />
            </figure>
            <p className="level-item">{video.url}</p>
          </div>
        </div>
      );
    } else {
      listItemContents = (
        <figure className="image is-thumbnail is-128x128 is-loading" />
      );
    }
    return <>{listItemContents}</>;
  }
}

VideoListItem.propTypes = {
  video: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export default VideoListItem;
