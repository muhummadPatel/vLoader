import React from "react";
import AddVideo from "Components/AddVideo";
import VideoList from "Components/VideoList";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      videos: [],
    };

    this.onAddVideo = this.onAddVideo.bind(this);
    this.onRemoveVideo = this.onRemoveVideo.bind(this);
  }

  onAddVideo(video) {
    this.setState((state) => {
      const { videos } = state;

      const isExistingVideo =
        videos.filter((existingVideo) => existingVideo.url === video.url)
          .length > 0;
      if (!isExistingVideo) {
        return { ...state, ...{ videos: videos.concat(video) } };
      }
      return state;
    });
  }

  onRemoveVideo(videoUrl) {
    this.setState((state) => {
      const { videos } = state;
      return {
        ...state,
        ...{ videos: videos.filter((oldVideo) => oldVideo.url !== videoUrl) },
      };
    });
  }

  render() {
    const { videos } = this.state;

    return (
      <div className="container">
        <div className="box has-background-white-bis">
          <AddVideo onAddVideo={this.onAddVideo} />
          <VideoList videos={videos} onRemoveVideo={this.onRemoveVideo} />
        </div>
      </div>
    );
  }
}

export default App;
