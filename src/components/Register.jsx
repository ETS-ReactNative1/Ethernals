import React, { useEffect, useState } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { useLocation } from "react-router-dom";
import { nft_abi } from "contracts/nft.js";
import NFTMint from "components/NFTMint";
// import "components/PublishStream.css";

import ReactHlsPlayer from "@panelist/react-hls-player";
import "components/StreamView.css";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";

function Register() {
  const { account, Moralis } = useMoralis();
  const [contractCall, setContractCall] = useState({});
  const [isReg, setIsReg] = useState(false);
  const [nfts, setNfts] = useState();

  const location = useLocation();
  const stream = location.state;
  const mint_params = {
    name: stream.attributes.title.concat(account),
    description: "NFT for registered user: ".concat(account),
    image: stream.attributes.img_hash,
  };
  const apiKey = process.env.REACT_APP_ALCHEMY_KEY;
  const web3 = createAlchemyWeb3(
    `https://polygon-mumbai.g.alchemy.com/v2/${apiKey}`,
  );

  const handleClick = () => {
    console.log(account);
    console.log(contractCall);
    console.log(nfts);
  };

  const initParams = {
    chain: "polygon",
    contractAddress: process.env.REACT_APP_NFT_CONTRACT,
    functionName: "mintNft",
    abi: nft_abi,
  };
  useEffect(async () => {
    const getFilehash = async () => {
      const file = new Moralis.File("file.json", {
        base64: btoa(JSON.stringify(mint_params)),
      });
      await file.saveIPFS();
      setContractCall({
        ...initParams,
        params: {
          receiver: account,
          tokenURI: `https://gateway.moralisipfs.com/ipfs/${file.hash()}`,
        },
      });
    };
    await getFilehash();
  }, []);

  useEffect(async () => {
    const alchemyFunc = async () => {
      const nfts_rec = await web3.alchemy.getNfts({
        owner: account,
        contractAddresses: [process.env.REACT_APP_NFT_CONTRACT],
      });
      console.log("nfts_rec", nfts_rec);
      setNfts(nfts_rec.ownedNfts);
      console.log("nfts has been set maaa");
      return nfts_rec.ownedNfts;
    };

    const final_temp = async () => {
      const temp_nfts = await alchemyFunc();
      console.log("final nfts set", temp_nfts);
      for (var i = 0; i < temp_nfts.length; i++) {
        const temp = stream.attributes.title.concat(account);
        console.log("temp", temp);
        if (temp_nfts[i].title == temp) {
          setIsReg(true);
          break;
        }
      }
    };
    final_temp();
  }, [setIsReg]);

  return (
    <>
      {!isReg ? (
        <>
          <div className="start-stream">
            {/* <button onClick={() => handleClick()}>check</button> */}
            {/* <h1>Start Stream</h1> */}
            {/* <button onClick={() => runContractFunction()} disabled={isLoading}>
                        Register
                    </button> */}
            <NFTMint params={contractCall} />
          </div>
        </>
      ) : (
        <>
          <div className="player-div">
            <ReactHlsPlayer
              src={stream.attributes.streamURL}
              autoPlay={true}
              controls={true}
              width="100%"
              height="600px"
            />
            {/* <button onClick={() => handleClick()}>check</button> */}
            <h1>{stream.attributes.title}</h1>
            <br />
            {/* <h3>Description</h3> */}
            <p>{stream.attributes.description}</p>
          </div>
        </>
      )}
      {/* <button onClick={handleClick}></button> */}
    </>
  );
}

export default Register;
