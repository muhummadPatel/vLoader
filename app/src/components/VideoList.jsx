import React from "react";
import PropTypes from "prop-types";
import VideoListItem from "Components/VideoListItem";

function VideoList(props) {
  const { videos, onRemoveVideo } = props;

  let contents;
  if (videos && videos.length > 0) {
    contents = videos.map((video) => (
      <div className="list-item" key={video.url}>
        <VideoListItem video={video} onRemoveVideo={onRemoveVideo} />
      </div>
    ));
  } else {
    contents = (
      <div className="list-item">
        <p className="is-size-6 has-text-centered">
          Get started by pasting a video link in the box above
        </p>
        <p className="is-size-4 has-text-centered">
          <span role="img" aria-label="hug">
            🤗
          </span>
        </p>
      </div>
    );
  }

  return <div className="list">{contents}</div>;
}

VideoList.propTypes = {
  videos: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
    })
  ).isRequired,
  onRemoveVideo: PropTypes.func.isRequired,
};

export default VideoList;
