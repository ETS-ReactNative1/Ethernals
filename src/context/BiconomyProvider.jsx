import { createContext, useEffect, useState, useMemo } from "react";
import { useChain, useMoralis } from "react-moralis";
import { Biconomy } from "@biconomy/mexa";
import Web3 from "web3";
import { notification } from "antd";
import { networkConfigs } from "helpers/networks";
import { streams_abi } from "contracts/streams.js";
// import simpleStorage from "list/simpleStorage.json";
// import biconomyApiKey from "helpers/biconomy";

export const BiconomyContext = createContext({});

const BiconomyContextProvider = (props) => {
  const { children } = props;
  const {
    isWeb3Enabled,
    web3,
    isAuthenticated,
    isWeb3EnableLoading,
    enableWeb3,
    Moralis,
  } = useMoralis();
  const { chainId } = useChain();
  const [isBiconomyInitialized, setIsBiconomyInitialized] = useState(false);
  const [biconomyProvider, setBiconomyProvider] = useState({});
  const [contract, setContract] = useState({});
  const contractAddress = "0x9142fF1cC50cC07b77CeA66F7667013FDd716A44";
  const biconomyApiKey = process.env.REACT_APP_BICONOMY_API_KEY;

  useEffect(() => {
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading && chainId) {
      enableWeb3();
    }
  }, [isAuthenticated, isWeb3Enabled, chainId]);

  useEffect(() => {
    const initializeBiconomy = async () => {
      if (isBiconomyInitialized) {
        // Resetting when reinitializing
        setIsBiconomyInitialized(false);
      }

      const walletWeb3 = await Moralis.enableWeb3();
      const networkProvider = new Web3.providers.HttpProvider(
        networkConfigs[chainId]?.rpcUrl,
      );
      const biconomy = new Biconomy(networkProvider, {
        // walletProvider: walletWeb3.currentProvider,
        apiKey: biconomyApiKey,
      });
      setBiconomyProvider(biconomy);

      // This web3 instance is used to read normally and write to contract via meta transactions.
      console.log("web3", web3);
      // if (
      //   isAuthenticated &&
      //   !isWeb3Enabled &&
      //   !isWeb3EnableLoading &&
      //   chainId
      // ) {

      web3.setProvider(biconomy);
      biconomy
        .onEvent(biconomy.READY, () => {
          setIsBiconomyInitialized(true);
          const contractInst = new web3.eth.Contract(
            streams_abi,
            contractAddress,
          );
          setContract(contractInst);
        })
        .onEvent(biconomy.ERROR, () => {
          // Handle error while initializing mexa
          notification.error({
            message: "Biconomy Initialization Fail",
            description:
              "Biconomy has failed to initialized. Please try again later.",
          });
        });
    };

    if (isAuthenticated && isWeb3Enabled && chainId !== "0x1") {
      initializeBiconomy();
    }
  }, [
    isAuthenticated,
    isWeb3Enabled,
    chainId,
    web3,
    streams_abi,
    contractAddress,
    Moralis,
  ]);

  return (
    <BiconomyContext.Provider
      value={{ isBiconomyInitialized, biconomyProvider, contract }}
    >
      {children}
    </BiconomyContext.Provider>
  );
};

export default BiconomyContextProvider;
