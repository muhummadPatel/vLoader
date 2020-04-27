import React from "react";
import { writeConfigRequest } from "secure-electron-store";
// import Motd from "Components/motd/Motd";
import AddVideo from "Components/addVideo/AddVideo";
import "./app.scss";

class App extends React.Component {
  constructor(props) {
    super(props);

    const initialMotd = window.api.store.initial().motd;
    this.state = {
      motd: typeof initialMotd !== "undefined" ? initialMotd : "Default value",
    };

    this.updateMotd = this.updateMotd.bind(this);
  }

  updateMotd(motd) {
    window.api.store.send(writeConfigRequest, "motd", motd);

    // update our state
    this.setState((state) => {
      return { ...state, ...{ motd } };
    });
  }

  render() {
    // const { motd } = this.state;
    return (
      <section className="section">
        <AddVideo />
      </section>
    );
  }
}

export default App;
