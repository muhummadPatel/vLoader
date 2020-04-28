import React from "react";
import AddVideo from "Components/AddVideo";
import VideoList from "Components/VideoList";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      videos: [
        {
          key: "myvideo.url",
          title: "myvideo",
        },
      ],
    };

    this.onAddVideo = this.onAddVideo.bind(this);
  }

  onAddVideo(video) {
    this.setState((state) => {
      const { videos } = state;
      return { ...state, ...{ videos: videos.concat(video) } };
    });
  }

  render() {
    const { videos } = this.state;

    return (
      <div className="container">
        <div className="box">
          <AddVideo onAddVideo={this.onAddVideo} />
          <VideoList videos={videos} />
        </div>
      </div>
    );
  }
}

export default App;
