import React from "react";
import PropTypes from "prop-types";
import VideoListItem from "Components/VideoListItem";

function VideoList(props) {
  const { videos } = props;

  let contents;
  if (videos && videos.length > 0) {
    contents = videos.map((video) => (
      <div className="list-item" key={video.url}>
        <VideoListItem video={video} />
      </div>
    ));
  } else {
    contents = (
      <div className="list-item">
        <div className="level">
          <p className="is-size-56 has-text-centered">
            Get started by pasting a video link in the box above
          </p>
          <p className="is-size-4 has-text-centered">
            <span role="img" aria-label="hug">
              🤗
            </span>
          </p>
        </div>
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
};

export default VideoList;
