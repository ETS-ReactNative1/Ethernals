import React from "react";
import { useState, useEffect } from "react";
import { useStateValue } from "../StateProvider";
import { useMoralis } from "react-moralis";
import axios from "axios";
import Blockie from "components/Blockie";
import { Card, Avatar } from "antd";
import { Link } from "react-router-dom";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import "components/Stream.css";

function Stream() {
  const [state, _] = useStateValue();
  const [streams, setStreams] = useState();
  const { Moralis } = useMoralis();
  const { Meta } = Card;

  const getStreams = async () => {
    const query = new Moralis.Query("PublishedStreams");
    const fetched_streams = await query.find();
    setStreams(fetched_streams);
    console.log(fetched_streams);
  };
  useEffect(() => {
    getStreams();
    // getThumbnail(streams[0].attributes.img_hash);
  }, []);

  // const getThumbnail = async (hash) => {
  //   const url = `https://gateway.moralisipfs.com/ipfs/${hash}`;
  //   return url;
  // }

  return (
    <div id="all-streams">
      <h3>Ongoing Events</h3>
      <div id="stream-cards">
        {streams ? (
          streams.map((stream) => {
            return (
              <Card
                className="stream-card"
                key={stream.attributes.transaction_hash}
                style={{ width: 300 }}
                cover={
                  <Link to={{ pathname: "/eventPlayer", state: stream }}>
                    <img
                      src={`https://gateway.moralisipfs.com/ipfs/${stream.attributes.img_hash}`}
                    />
                  </Link>
                }
              >
                <Link to="/eventPlayer" params={stream}>
                  <Meta
                    avatar={
                      <Blockie address={stream.attributes.author} size={7} />
                    }
                    title={stream.attributes.title}
                    description={stream.attributes.description}
                  />
                </Link>
              </Card>
              // <div key={stream}>

              /* <p>stream name: {stream.attributes.title}</p>
              <br />
              <p>stream hash: {stream.attributes.img_hash}</p>
              <br />
              <img
                src={`https://gateway.moralisipfs.com/ipfs/${stream.attributes.img_hash}`}
              ></img> */

              // </div>
            );
          })
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default Stream;
