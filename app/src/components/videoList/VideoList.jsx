import React from "react";

class VideoList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      videos: [
        {
          key: "1",
          title: "test1",
        },
        {
          key: "2",
          title: "test2",
        },
      ],
    };
  }

  render() {
    const { videos } = this.state;

    const videoItems = videos.map((video) => (
      <div className="list-item" key={video.key}>
        video.title
      </div>
    ));

    return <div className="list">{videoItems}</div>;
  }
}

export default VideoList;
