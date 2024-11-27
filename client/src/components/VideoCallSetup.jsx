import React, { useState } from "react";
import useAxios from "../hooks/useAxios";
import { useLocation, useNavigate } from "react-router-dom";
import { VideoIcon } from "lucide-react"; // Assuming you're using lucide-react

const VideoCallSetup = () => {
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState(""); 
  const [error, setError] = useState("");
  const location = useLocation();
  const { bookingId } = location.state || {}

  const createRoom = async () => {
    // Input validation
    if (!roomName.trim()) {
      setError("Please enter a room name");
      return;
    }

    try {
      const response = await axiosInstance.post("create-daily-room/", {
        room_name: roomName.trim(), 
      });
      
      const { room, token } = response.data;
      const roomUrlWithToken = `${room.url}?t=${token}`;
      // await axiosInstance.patch(`bookings/${bookingId}/`)
      navigate('/video-call', { 
        state: { 
          roomUrl: roomUrlWithToken,
        } 
      });
    } catch (error) {
      console.error("Room creation failed", error);
      setError("Failed to create room. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8 space-y-6">
        <div className="text-center">
          <VideoIcon className="mx-auto h-12 w-12 text-blue-600 mb-4" />
          <h3 className="text-2xl font-bold text-gray-800">Join Video Call Room</h3>
          <p className="text-gray-500 mt-2">Enter the unique room name that provided to you</p>
        </div>

        <div>
          <label htmlFor="roomName" className="block text-sm font-medium text-gray-700 mb-2">
            Room Name
          </label>
          <input
            id="roomName"
            type="text"
            required
            value={roomName}
            onChange={(e) => {
              setRoomName(e.target.value);
              setError(""); // Clear error when user starts typing
            }}
            placeholder="Enter room name"
            className="w-full px-4 py-2 border border-gray-300 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 
                       focus:border-transparent transition duration-300"
          />
          {error && (
            <p className="text-red-500 text-sm mt-2 animate-bounce">
              {error}
            </p>
          )}
        </div>

        <button 
          onClick={createRoom} 
          className="w-full bg-blue-600 text-white py-3 rounded-md 
                     hover:bg-blue-700 transition duration-300 
                     flex items-center justify-center space-x-2
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          <VideoIcon className="h-5 w-5 mr-2" />
          Join Room
        </button>

        <div className="text-center text-xs text-gray-400 mt-4">
          <p>Secure video call room creation</p>
        </div>
      </div>
    </div>
  );
};

export default VideoCallSetup;