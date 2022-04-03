import React, { useEffect } from "react";
import { useWeb3Contract, useMoralis, useNFTBalances } from "react-moralis";
// import { useMoralisWeb3Api } from "react-moralis";
// alchemy-nft-api/alchemy-web3-script.js
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import { useLocation } from "react-router-dom";
import { nft_abi } from "contracts/nft.js";

function NFTMint(params) {
  const { account, Moralis } = useMoralis();
  const { getNFTBalances, data, error, isLoading, isFetching } =
    useNFTBalances();
  // const Web3Api = useMoralisWeb3Api();
  // Replace with your Alchemy api key:
  const apiKey = process.env.REACT_APP_ALCHEMY_KEY;

  // Initialize an alchemy-web3 instance:
  const web3 = createAlchemyWeb3(
    `https://polygon-mumbai.g.alchemy.com/v2/${apiKey}`,
  );

  const handleClick = async () => {
    console.log(account);
    console.log(data);
    //Get metadata for one token. Ex: USDT token on ETH
    // const options = {
    //     chain: "eth",
    //     addresses: account,
    // };
    // const tokenMetadata = await Web3Api.token.getTokenMetadata(options);
    // console.log(tokenMetadata);

    // const response = await web3.alchemy.getNftMetadata({
    // contractAddress: process.env.REACT_APP_NFT_CONTRACT,
    // tokenId: "1590"
    // })

    const nfts = await web3.alchemy.getNfts({
      owner: account,
      contractAddresses: [process.env.REACT_APP_NFT_CONTRACT],
    });

    console.log(nfts);
  };
  return (
    <>
      <button
        onClick={() =>
          console.log(
            getNFTBalances({ params: { chain: "polygon", address: account } }),
          )
        }
      >
        Refetch
      </button>
      <button onClick={() => handleClick()}>check</button>
    </>
  );
}

export default NFTMint;
