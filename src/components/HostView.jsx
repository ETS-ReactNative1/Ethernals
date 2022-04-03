import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useStateValue } from "../StateProvider";
import ReactHlsPlayer from "@panelist/react-hls-player";
import { getStreamStatus } from "utils/apiFactory";
import { Drawer, Button } from "antd";

import "components/HostView.css";
function HostView() {
  const [state, dispatch] = useStateValue();
  const [streamKey, setStreamKey] = useState();
  const location = useLocation();
  const stream = location.state;
  const [drawer, setDrawer] = useState({ visible: false, placement: "bottom" });
  const showDrawer = () => {
    setDrawer({
      ...drawer,
      visible: true,
    });
  };

  const onClose = () => {
    setDrawer({
      ...drawer,
      visible: false,
    });
  };

  const onChange = (e) => {
    setDrawer({
      ...drawer,
      placement: e.target.value,
    });
  };

  useEffect(async () => {
    const streamStatusResponse = await getStreamStatus(
      state.apiKey,
      stream.attributes.streamId,
      // stream.attributes.streamId,
    );
    setStreamKey(streamStatusResponse.data.streamKey);
  }, []);
  const handleClick = () => {
    console.log(stream);
    console.log("appiKey", state.apiKey);
    console.log("response:", streamKey);
  };
  return (
    <div className="player-div">
      <ReactHlsPlayer
        src={stream.attributes.streamURL}
        autoPlay={false}
        controls={true}
        width="100%"
        height="600px"
      />
      {/* <button onClick={() => handleClick()}>check</button> */}
      <h1>{stream.attributes.title}</h1>
      <br />
      <h3>Description</h3>
      <p>{stream.attributes.description}</p>
      <button type="primary" onClick={showDrawer}>
        OBS parameters
      </button>
      <Drawer
        title="Basic Drawer"
        placement={drawer.placement}
        closable={false}
        onClose={onClose}
        visible={drawer.visible}
      >
        <h1>Stream Key: {streamKey}</h1>
        <h1>Server: rtmp://rtmp.livepeer.com/live </h1>
      </Drawer>
    </div>
  );
}

export default HostView;
