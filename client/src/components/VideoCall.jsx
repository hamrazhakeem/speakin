import React, { useRef, useEffect } from "react";
import DailyIframe from "@daily-co/daily-js";
import { useLocation, useNavigate } from "react-router-dom";

const VideoCall = () => {
  const videoCallFrameRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { roomUrl } = location.state || {};

  useEffect(() => {
    if (!roomUrl) {
      // Redirect or show error if no room URL
      navigate('/video-call-setup');
      return;
    }

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
