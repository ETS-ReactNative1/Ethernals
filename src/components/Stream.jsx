import React from 'react'
import { useState, useEffect } from 'react';
import ReactHlsPlayer from '@panelist/react-hls-player';
import { useStateValue } from "../StateProvider";
import { useMoralis } from 'react-moralis';
import axios from "axios";
function Stream() {
  const [state, _] = useStateValue();
  const [streams, setStreams] = useState();
  const { Moralis } = useMoralis();
  const getStreams = async () => {
    const query = new Moralis.Query("Streams");
    const fetched_streams = await query.find();
    setStreams(fetched_streams);
    console.log(fetched_streams);
  }
  useEffect(() => {
    getStreams();
    // getThumbnail(streams[0].attributes.img_hash);
  }, [])

  // const getThumbnail = async (hash) => {
  //   const url = `https://gateway.moralisipfs.com/ipfs/${hash}`;
  //   return url;
  // }

  return (
    <>
      {
        (streams) ? streams.map((stream) => {
          return (
            <div key={stream}>
              <p>stream name: {stream.attributes.title}</p><br />
              <p>stream hash: {stream.attributes.img_hash}</p><br />
              <img src={`https://gateway.moralisipfs.com/ipfs/${stream.attributes.img_hash}`}></img>
              {/* <ReactHlsPlayer
                src={stream.attributes.playbackURL}
                autoPlay={true}
                controls={true}
                width="100%"
                height="600px"
              /> */}
            </div>
          )
        }) : <></>
      }
    </>
  )
}

export default Stream