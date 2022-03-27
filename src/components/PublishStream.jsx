import React, { useEffect } from "react";
import { useWeb3Contract } from "react-moralis";
import "components/PublishStream.css";
function PublishStream(params) {
  const { runContractFunction, contractResponse, error, isRunning, isLoading } =
    useWeb3Contract(params.params);
  return (
    <>
      {!contractResponse ? (
        <div>
          <h1>Start Stream</h1>
          <button onClick={() => runContractFunction()} disabled={isLoading}>
            Start Stream
          </button>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

export default PublishStream;
