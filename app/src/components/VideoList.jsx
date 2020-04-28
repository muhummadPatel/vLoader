import React from "react";
import PropTypes from "prop-types";

function VideoList(props) {
  const { videos } = props;

  const videoItems = videos.map((video) => (
    <div className="list-item" key={video.key}>
      {video.title}
    </div>
  ));

  return <div className="list">{videoItems}</div>;
}

VideoList.propTypes = {
  videos: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default VideoList;
