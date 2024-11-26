import React, { useRef, useEffect } from "react";
import DailyIframe from "@daily-co/daily-js";

const VideoCall = ({ roomUrl }) => {
  const videoCallFrameRef = useRef(null);

  useEffect(() => {
    const callFrame = DailyIframe.createFrame(videoCallFrameRef.current, {
      showLeaveButton: true, // Show "Leave" button
      iframeStyle: {
        width: "100%",
        height: "100%",
        border: "0",
      },
    });

    callFrame.join({ url: roomUrl });

    return () => callFrame.destroy(); // Cleanup on component unmount
  }, [roomUrl]);

  return <div ref={videoCallFrameRef} style={{ width: "100%", height: "100vh" }} />;
};

export default VideoCall;
