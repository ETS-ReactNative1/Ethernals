import React, { useEffect } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { useLocation } from "react-router-dom";
import { nft_abi } from "contracts/nft.js";

// import "components/PublishStream.css";
function NFTMint(params) {

    const handleClick = () => {
        console.log(params.params);
    };
    const { runContractFunction, contractResponse, error, isRunning, isLoading } =
        useWeb3Contract(params.params);

    return (
        <>
            {/* <button onClick={() => handleClick()}>
                Check 2
            </button> */}
            <button onClick={() => runContractFunction()} disabled={isLoading}>
                Register
            </button>
        </>
    );
}

export default NFTMint;
