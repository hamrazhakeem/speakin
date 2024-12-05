import React, { useRef, useEffect, useCallback, useState } from "react";
import DailyIframe from "@daily-co/daily-js";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useAxios from "../hooks/useAxios";

const VideoCall = () => {
  const axiosInstance = useAxios();
  const callFrameRef = useRef(null);
  const videoCallFrameRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { roomUrl, bookingId } = location.state || {};
  const { userId } = useSelector((state) => state.auth);

  const fetchAndUpdateBooking = useCallback(async () => {
    try {
      // Fetch the user details
      const response = await axiosInstance.get(`users/${userId}/`);
      const user = response.data;
      console.log("User: bookingiddd", user, bookingId);

      // Extract user type
      const userType = user.user_type; // Assuming `user_type` is the field

      if (userType && bookingId) {
        // Determine the field to update based on the user type
        const fieldToUpdate = 
          userType === "student" ? "student_joined_at" : "tutor_joined_at";

        // Make the PATCH request to update the booking
        await axiosInstance.patch(`bookings/${bookingId}/`, {
          [fieldToUpdate]: new Date().toISOString(), // Send the current timestamp
        });

        console.log(`${fieldToUpdate} updated successfully.`);
      }
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  }, [axiosInstance, userId, bookingId]);

  const handleMeetingLeft = useCallback(() => {
    // Navigate to meeting summary page
    console.log("Meeting left", bookingId);
    navigate('/meeting-summary', { 
      state: { 
        bookingId: bookingId
      } 
    });
  }, [navigate, bookingId]);

  useEffect(() => {
    if (userId) {
      fetchAndUpdateBooking();
    }
  }, [fetchAndUpdateBooking]);

  const handleError = useCallback((event) => {
    console.error('Daily.co error:', event);
    navigate('/video-call-setup');
  }, [navigate]);

  useEffect(() => {
    if (!roomUrl) {
      navigate('/video-call-setup');
      return;
    }

    const callFrame = DailyIframe.createFrame(videoCallFrameRef.current, {
      showLeaveButton: true,
      iframeStyle: {
        width: "100%",
        height: "100%",
        border: "0",
      },
    });

    // Store the callFrame reference
    callFrameRef.current = callFrame;

    // Add event listeners
    callFrame.on('error', handleError);
    callFrame.on('left-meeting', handleMeetingLeft);

    // Join the room
    callFrame.join({ url: roomUrl });

    // Cleanup function
    return () => {
      if (callFrameRef.current) {
        // Remove specific event listeners before destroying
        callFrameRef.current.off('error', handleError);
        callFrameRef.current.off('left-meeting', handleMeetingLeft);
        
        // Destroy the call frame
        callFrameRef.current.destroy();
        
        // Clear the reference
        callFrameRef.current = null;
      }
    };
  }, [roomUrl, handleError, handleMeetingLeft]);

  return <div ref={videoCallFrameRef} style={{ width: "100%", height: "100vh" }} />;
};

export default VideoCall;