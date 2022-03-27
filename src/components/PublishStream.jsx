import React, { useEffect } from 'react';
import { useWeb3Contract } from "react-moralis";

function PublishStream(params) {
  
  const { runContractFunction, contractResponse, error, isRunning, isLoading } = useWeb3Contract(params.params);
  return (
    <>
    {
    (!contractResponse)?(<div>
      <h1>Confirm?</h1>
      <button onClick={() => runContractFunction()} disabled={isLoading}>Confirm</button>
    </div>):(<></>)
    }
    </>
  )
}

export default PublishStream