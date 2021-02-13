import React, { useEffect } from "react";
import useOpenTok from "react-use-opentok";
import axios from "axios";
import "../../assets/css/ORB.css";

function DemoWithVonage() {
  const [opentokProps, opentokMethods] = useOpenTok();

  const {
    // connection info
    isSessionInitialized,
    connectionId,
    isSessionConnected,

    // connected data
    session,
    connections,
    streams,
    subscribers,
    publisher,
  } = opentokProps;

  const {
    initSessionAndConnect,
    disconnectSession,
    publish,
    unpublish,
    subscribe,
    unsubscribe,
    sendSignal,
  } = opentokMethods;

  // STEP 2: Mockup fetching apiKey, sessionId, and token from server
  useEffect(() => {
    axios
      .post(`${process.env.REACT_APP_API_URL}api/vonage/createVonageSession`)
      .then(result => {
        const credentials = {
          apiKey: result.data.sessionData.session.ot.apiKey,
          sessionId: result.data.sessionData.session.sessionId,
          token: result.data.sessionData.token,
        };
        initSessionAndConnect(credentials);
      });
  }, [initSessionAndConnect]);

  const publishStrea = () => {
    console.log("isSessionInitialized", isSessionInitialized);
    const pubOptions = {
      name: "camera",
      inserMode: "replace",
      element: "orb_publish",
      width: 400,
      height: 300,
    };
    publish(pubOptions);
  };

  return (
    <div>
      <button onClick={publishStrea}>Publish</button>
      <div id="orb_publish"></div>
    </div>
  );
}

export default DemoWithVonage;
