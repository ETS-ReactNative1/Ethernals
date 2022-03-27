import React from 'react'
import {useState, useEffect} from 'react';
import ReactHlsPlayer from '@panelist/react-hls-player';
import {useStateValue} from "../StateProvider";
import {useMoralis} from 'react-moralis';

function Stream() {
  const [state, _] = useStateValue();
  const [streams, setStreams] = useState();
  const {Moralis} = useMoralis();
  const getStreams = async () => {
    const query = new Moralis.Query("Streams");
    const fetched_streams = await query.find();
    setStreams(fetched_streams);
    console.log(fetched_streams);
  }
  useEffect(() => {
    getStreams();
  }, [])
  
  return (
        <>
        {
          (streams)?streams.map((stream)=>{
            return(
              <div>
                <p>stream name: {stream.attributes.title}</p><br/>
                <ReactHlsPlayer
                  src={stream.attributes.playbackURL}
                  autoPlay={true}
                  controls={true}
                  width="100%"
                  height="600px"
                />
              </div>
            )
          }):<></>
        }
        </>
  )
}

export default Stream