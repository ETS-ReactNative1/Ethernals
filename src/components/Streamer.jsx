import {React, useState, useEffect} from 'react';
import {useStateValue} from "../StateProvider";
import { createStream, getStreamStatus} from "utils/apiFactory";
import { APP_STATES } from "utils/types";
import {streams_abi} from "contracts/streams"
import PublishStream from './PublishStream';

function Streamer() {
    const [state, dispatch] = useStateValue();
    const [functionCallParams, setFunctionCallParams] = useState({});
    const [contractCall, setContractCall] = useState({});
    const handleChange = (event) => {
      const name = event.target.name;
      const value = event.target.value;
      setFunctionCallParams(values => ({...values, [name]: value}))
    }
    useEffect(() => {
      if (state.appState === APP_STATES.CREATING_STREAM) {
        (async function () {
          try {
            const streamCreateResponse = await createStream(state.apiKey);
            if (streamCreateResponse.data) {
              const streamData= {
                streamId: streamCreateResponse.data.id,
                streamKey: streamCreateResponse.data.streamKey,
                playbackId: streamCreateResponse.data.playbackId,
              };
              console.log(streamData);
              dispatch({
                type: "STREAM_CREATED",
                payload: {...streamData},
              });
              
            }
          } catch (error) {
            if (error.response.status === 403) {
              dispatch({
                type: "INVALID_API_KEY",
                payload: {
                  message:
                    "Invalid API Key. Please try again with right API key!",
                },
              });
            } else {
              dispatch({
                type: "INVALID_API_KEY",
                payload: {
                  message:
                    "Something went wrong! Please try again after sometime",
                },
              });
            }
          }
        })();
      }
      if(state.appState === APP_STATES.WAITING_FOR_VIDEO) {
        // console.log(state)
        console.log(functionCallParams)
        const sendOptions = {
          chain: "polygon",
          contractAddress: "0x9142fF1cC50cC07b77CeA66F7667013FDd716A44",
          functionName: "publishStream",
          abi: streams_abi,
          params: { ...functionCallParams,
            _streamUrl: state.playbackURL,
            _isActive: false,
          },
        };
        console.log(sendOptions)
        setContractCall(sendOptions);
      }
      let interval;
      if (state.streamId) {
        interval = setInterval(async () => {
          const streamStatusResponse = await getStreamStatus(
            state.apiKey,
            state.streamId
          );
          if (streamStatusResponse.data) {
            const { isActive } = streamStatusResponse.data;
            dispatch({
              type: isActive ? "VIDEO_STARTED" : "VIDEO_STOPPED",
            });
          }
        }, 5000);
      }
  
      return () => {
        clearInterval(interval);
      };
    }, [state.appState]);


  return (
    <div>
      <form onSubmit={(event) => {
          event.preventDefault();
          dispatch({
            type: 'CREATE_CLICKED',
          });
        }
      }>

          <input type="text" name="_title"  placeholder="Stream Name" onChange={handleChange}/><br/>
          <input type="text" name="_imgHash"  placeholder="Image Hash" onChange={handleChange}/><br/>
          <input type="text" name="_description"  placeholder="Stream Description" onChange={handleChange}/><br/>
          <input type="datetime-local" id="meeting-time" name="_date"  onChange={handleChange}/><br/>
        <input type="submit" value="Publish Stream"/>
      </form>
      
      {/* {
        ((state.appState==APP_STATES.WAITING_FOR_VIDEO)&&(state.error==null))&&(<><p>
          Stream Key: {state.streamKey}<br/>
          Stream ID: {state.streamId}<br/>
          Playback ID: https://cdn.livepeer.com/hls/{state.playbackId}/index.m3u8<br/>
        </p>
        </>
        )
      }  */}
      {
        ((state.appState==APP_STATES.WAITING_FOR_VIDEO)&&(state.error==null))&& <PublishStream params={contractCall}/>   
      }
      
    </div>
  )
}

export default Streamer