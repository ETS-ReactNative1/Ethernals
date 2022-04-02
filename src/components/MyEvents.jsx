import React, { useState, useEffect } from 'react';
import { useMoralis } from "react-moralis";
import Blockie from "components/Blockie";
import { Card, Avatar } from "antd";
import { Link } from "react-router-dom";
import "components/MyEvents.css";

function MyEvents() {
  const { Moralis, account } = useMoralis();
  const { Meta } = Card;
  const [streams, setStreams] = useState();

  useEffect(async () => {
    // getStreams();
    const query = new Moralis.Query("streams");
    query.equalTo("author", account);
    const fetched_streams = await query.find();
    setStreams(fetched_streams);
    console.log(fetched_streams);
    // getThumbnail(streams[0].attributes.img_hash);
  }, []);
  return (
    <>
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
                    <Link to={{ pathname: "/eventHost", state: stream }}>
                      <img
                        src={`https://gateway.moralisipfs.com/ipfs/${stream.attributes.img_hash}`}
                      />
                    </Link>
                  }
                >
                  <Link to={{ pathname: "/eventHost", state: stream }}>
                    <Meta
                      avatar={
                        <Blockie address={stream.attributes.author} size={7} />
                      }
                      title={stream.attributes.title}
                      description={stream.attributes.description}
                    />
                  </Link>
                </Card>
              );
            })
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  )
}

export default MyEvents