import React from "react";
import AddVideo from "Components/addVideo/AddVideo";
import VideoList from "Components/videoList/VideoList";
import "./app.scss";

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    // const { motd } = this.state;
    return (
      <div className="container">
        <div className="box">
          <AddVideo />
          <VideoList />
        </div>
      </div>
    );
  }
}

export default App;
