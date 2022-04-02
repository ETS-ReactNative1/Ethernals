import { React, useState, useEffect, useRef } from "react";
import { useStateValue } from "../StateProvider";
import { createStream, getStreamStatus } from "utils/apiFactory";
import { APP_STATES } from "utils/types";
import { streams_abi } from "contracts/streams";
import PublishStream from "./PublishStream";
import { useMoralis, useWeb3Contract } from "react-moralis";

import "components/Streamer.css";
import logoLight from "../assets/Logo-light.png";
import { Upload, message, DatePicker } from "antd";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";

function Streamer() {
  const [state, dispatch] = useStateValue();
  const { Moralis } = useMoralis();
  const [functionCallParams, setFunctionCallParams] = useState({});
  const [contractCall, setContractCall] = useState({});
  const [isdisabled, setIsdisabled] = useState(false);
  const [file, setFile] = useState();
  // const { Dragger } = Upload;
  const file_input_label = useRef(null);

  // const props = {
  //   name: "file",
  //   multiple: true,
  //   action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
  //   onChange(info) {
  //     const { status } = info.file;
  //     if (status !== "uploading") {
  //       console.log(info.file, info.fileList);
  //     }
  //     if (status === "done") {
  //       message.success(`${info.file.name} file uploaded successfully.`);
  //     } else if (status === "error") {
  //       message.error(`${info.file.name} file upload failed.`);
  //     }
  //   },
  //   onDrop(e) {
  //     console.log("Dropped files", e.dataTransfer.files);
  //   },
  // };

  const handleChange = (event) => {
    const name = event.target.name;
    console.log("name", name);
    const value = event.target.value;
    console.log("value", value);
    setFunctionCallParams((values) => ({ ...values, [name]: value }));
  };
  const handleFile = (event) => {
    event.preventDefault();
    setFile(event.target.files[0]);
    console.log(file);
    // file_input_label.current.innerHTML = event.target.files[0].name;
  };
  useEffect(async () => {
    if (state.appState === APP_STATES.CREATING_STREAM) {
      (async function () {
        try {
          const streamCreateResponse = await createStream(state.apiKey, functionCallParams._title);
          if (streamCreateResponse.data) {
            const streamData = {
              streamId: streamCreateResponse.data.id,
              streamKey: streamCreateResponse.data.streamKey,
              playbackId: streamCreateResponse.data.playbackId,
            };
            console.log(streamData);
            dispatch({
              type: "STREAM_CREATED",
              payload: { ...streamData },
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
    if (state.appState === APP_STATES.WAITING_FOR_VIDEO) {
      // console.log(state)
      const MoralisFile = new Moralis.File(file.name, file);
      await MoralisFile.saveIPFS();
      const imghash = MoralisFile.hash();
      console.log("imgHash", imghash);
      const sendOptions = {
        chain: "polygon",
        contractAddress: process.env.REACT_APP_CONTRACT_ADDRESS,
        functionName: "publishStream",
        abi: streams_abi,
        params: {
          ...functionCallParams,
          _streamUrl: state.playbackURL,
          _streamId: state.streamId,
          _imgHash: imghash,
          _isActive: false,
        },
      };
      console.log(sendOptions);
      setContractCall(sendOptions);
    }
    let interval;
    if (state.streamId) {
      interval = setInterval(async () => {
        const streamStatusResponse = await getStreamStatus(
          state.apiKey,
          state.streamId,
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

  // // ------------
  // const { RangePicker } = DatePicker;

  // function onChange(value, dateString) {
  //   console.log("Selected Time: ", value);
  //   console.log("Formatted Selected Time: ", dateString);
  // }

  // function onOk(value) {
  //   console.log("onOk: ", value);
  // }
  // -------------
  return (
    <>
      {!isdisabled ? (
        <>
          <div id="streamer-component">
            <img id="form-logo" src={logoLight} />
            <div id="form-head"> Host an Event </div>
            <form
              className="form"
              onSubmit={(event) => {
                event.preventDefault();
                setIsdisabled(true);
                dispatch({
                  type: "CREATE_CLICKED",
                });
              }}
            >
              <input
                type="text"
                name="_title"
                placeholder="Stream Name"
                onChange={handleChange}
              />
              <br />
              {/* <div id="thubnail-div">
                <span>Thubnail image</span>
                <div>
                  <label>
                    Choose
                    <input
                      type="file"
                      accept="image/*"
                      name="img_file"
                      placeholder="Image"
                      onChange={handleFile}
                    />
                    <span>Choose</span>
                    <br />
                  </label>
                </div>
              </div> */}

              {/* ----neww */}
              <div id="thubnail-div">
                <span>Thubnail image</span>
                {/* <div> */}
                <label>
                  <span ref={file_input_label}>Choose a file</span>
                  <input
                    type="file"
                    accept="image/*"
                    name="img_file"
                    id="imgFileInput"
                    className="fileinput"
                    placeholder="Image"
                    onChange={handleFile}
                  />
                </label>
                {/* </div> */}
              </div>

              {/* ------- */}

              <input
                type="text"
                name="_description"
                placeholder="Stream Description"
                onChange={handleChange}
              />
              {/* ----------- */}
              {/* <br />
        <div className="drag-area">
          <div className="icon">
            <UploadOutlined />
          </div>
          <header>Drag & Drop to Upload File</header>
          <span>OR</span>
          <button>Browse File</button>
          <input type="file" hidden />
        </div> */}
              {/* -------- */}
              <br />
              <input
                type="datetime-local"
                id="meeting-time"
                name="_date"
                onChange={handleChange}
              />
              {/* <DatePicker showTime onChange={handleChange} onOk={onOk} /> */}
              <br />
              <input
                type="submit"
                value="Publish Stream"
                disabled={isdisabled}
              />
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
          </div>
        </>
      ) : (
        <>
          <div className="streamstartkeys">
            <div className="streamkeys">
              <h1>
                Stream Key: <span>{state.streamKey}</span>
              </h1>

              <br />
              <h1>
                Playback URL: <span>{state.playbackURL}</span>
              </h1>
            </div>
            <br />
            <div>
              {state.appState == APP_STATES.WAITING_FOR_VIDEO &&
                contractCall != {} && <PublishStream params={contractCall} />}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Streamer;
