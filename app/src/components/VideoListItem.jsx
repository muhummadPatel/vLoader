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
        <figure className="image is-128x128">
          <img src={thumbnail} alt="video-thumbnail" />
        </figure>
      );
    } else {
      listItemContents = video.url;
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
