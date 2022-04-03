import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactHlsPlayer from "@panelist/react-hls-player";
import "components/StreamView.css";
function StreamView() {
  const location = useLocation();
  const stream = location.state;
  // useEffect(() => {
  //   console.log(stream);
  // }, []);
  const handleClick = () => {
    console.log(stream);
  };
  return (
    <div className="player-div">
      <ReactHlsPlayer
        src={stream.attributes.streamURL}
        autoPlay={true}
        controls={true}
        width="100%"
        height="600px"
      />
      <button onClick={() => handleClick()}>check</button>
      <h1>{stream.attributes.title}</h1>
      <br />
      {/* <h3>Description</h3> */}
      <p>{stream.attributes.description}</p>
    </div>
  );
}

export default StreamView;
