import { useEffect } from "react";
import { useMoralis } from "react-moralis";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Account from "components/Account/Account";
import Chains from "components/Chains";
import TokenPrice from "components/TokenPrice";
import Wallet from "components/Wallet";
import { Layout } from "antd";
import "antd/dist/antd.css";
import NativeBalance from "components/NativeBalance";
import "./style.css";
import QuickStart from "components/QuickStart";
import MenuItems from "./components/MenuItems";
import StreamView from "components/StreamView";
import HostView from "components/HostView";
import Stream from "components/Stream";
import Streamer from "components/Streamer";
import Register from "components/Register";
import IsRegistered from "components/IsRegistered";
import { StateProvider } from "StateProvider";
const { Header } = Layout;
import { APP_STATES } from "utils/types";
import MyEvents from "components/MyEvents";
import logoLight from "./assets/Logo-dark.png";

const styles = {
  content: {
    display: "flex",
    justifyContent: "center",
    fontFamily: "Roboto, sans-serif",
    color: "#041836",
    marginTop: "130px",
    padding: "10px",
  },
  header: {
    position: "fixed",
    zIndex: 1,
    width: "100%",
    background: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontFamily: "Roboto, sans-serif",
    borderBottom: "2px solid rgba(0, 0, 0, 0.06)",
    padding: "0 10px",
    boxShadow: "0 1px 10px rgb(151 164 175 / 10%)",
  },
  headerRight: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    fontSize: "15px",
    fontWeight: "600",
  },
};
const App = ({ isServerInfo }) => {
  const livepeerApiKey = process.env.REACT_APP_lIVEPEER_API_KEY;
  const { isWeb3Enabled, enableWeb3, isAuthenticated, isWeb3EnableLoading } =
    useMoralis();
  const initialState = {
    appState: APP_STATES.API_KEY,
    apiKey: livepeerApiKey,
    streamId: null,
    playbackId: null,
    playbackURL: null,
    streamKey: null,
    streamIsActive: false,
    error: null,
  };
  useEffect(() => {
    const connectorId = window.localStorage.getItem("connectorId");
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading)
      enableWeb3({ provider: connectorId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isWeb3Enabled]);

  const reducer = (state, action) => {
    switch (action.type) {
      case "streamKeyInput":
        return {
          ...state,
          states: action.newStreamKey,
        };
      case "CREATE_CLICKED":
        return {
          ...state,
          appState: APP_STATES.CREATING_STREAM,
        };
      case "STREAM_CREATED":
        return {
          ...state,
          appState: APP_STATES.WAITING_FOR_VIDEO,
          streamId: action.payload.streamId,
          playbackId: action.payload.playbackId,
          playbackURL: `https://cdn.livepeer.com/hls/${action.payload.playbackId}/index.m3u8`,
          streamKey: action.payload.streamKey,
        };
      case "VIDEO_STARTED":
        return {
          ...state,
          appState: APP_STATES.SHOW_VIDEO,
          streamIsActive: true,
        };
      case "VIDEO_STOPPED":
        return {
          ...state,
          appState: APP_STATES.WAITING_FOR_VIDEO,
          streamIsActive: false,
        };
      case "INVALID_API_KEY":
        return {
          ...state,
          error: action.payload.message,
        };

      default:
        return state;
    }
  };

  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      <Layout style={{ height: "100vh", overflow: "auto" }}>
        <Router>
          <Header style={styles.header}>
            <Logo />
            <MenuItems />
            <div style={styles.headerRight}>
              <Chains />
              {/* <TokenPrice
                address="0x1f9840a85d5af5bf1d1762f925bdaddc4201f984"
                chain="eth"
                image="https://cloudflare-ipfs.com/ipfs/QmXttGpZrECX5qCyXbBQiqgQNytVGeZW5Anewvh2jc4psg/"
                size="40px"
              /> */}
              <NativeBalance />
              <Account />
            </div>
          </Header>

          <div style={styles.content}>
            <Switch>
              <Route exact path="/quickstart">
                <QuickStart isServerInfo={isServerInfo} />
              </Route>
              <Route path="/stream">
                <Streamer />
              </Route>
              <Route path="/watchStream">
                <Stream />
              </Route>
              <Route path="/eventPlayer">
                <StreamView />
              </Route>
              <Route path="/register">
                <Register />
              </Route>
              <Route path="/isRegistered">
                <IsRegistered />
              </Route>
              <Route path="/eventHost">
                <HostView />
              </Route>
              <Route path="/myEvents">
                <MyEvents />
              </Route>
              <Route path="/">
                <Redirect to="/quickstart" />
              </Route>
              <Route path="/ethereum-boilerplate">
                <Redirect to="/quickstart" />
              </Route>
              <Route path="/nonauthenticated">
                <>Please login using the "Authenticate" button</>
              </Route>
            </Switch>
          </div>
        </Router>
      </Layout>
    </StateProvider>
  );
};

export const Logo = () => (
  <div id="logo-div" style={{ display: "flex" }}>
    <img id="logo" src={logoLight} />
    <h1 id="banner-name">StreamHance</h1>
  </div>
);

export default App;
