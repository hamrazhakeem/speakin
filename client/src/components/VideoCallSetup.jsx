import React, { useState } from "react";
import VideoCall from "./VideoCall";
import useAxios from "../hooks/useAxios";

const VideoCallSetup = () => {
  const axiosInstance = useAxios();
  const [roomUrl, setRoomUrl] = useState(null);
  const [roomName, setRoomName] = useState(""); // State for the room name input
  const [maxParticipants, setMaxParticipants] = useState(2); // Optional: max participants

  const createRoom = async () => {
    try {
      const response = await axiosInstance.post("create-daily-room/", {
        room_name: roomName || undefined, // Pass room name if provided
        max_participants: maxParticipants, // Optional: Customize participants
      });
      setRoomUrl(response.data.room.url); // Set the generated room URL
    } catch (error) {
      console.error("Error creating room:", error.response?.data || error.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {!roomUrl ? (
        <div>
          <h3>Create a Video Call Room</h3>
          <div style={{ marginBottom: "10px" }}>
            <label>
              Room Name:{" "}
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Enter room name (optional)"
                style={{ margin: "5px", padding: "5px", width: "200px" }}
              />
            </label>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>
              Max Participants:{" "}
              <input
                type="number"
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(Number(e.target.value))}
                placeholder="Max participants"
                min="1"
                max="50"
                style={{ margin: "5px", padding: "5px", width: "100px" }}
              />
            </label>
          </div>
          <button onClick={createRoom} style={{ padding: "10px 20px", cursor: "pointer" }}>
            Create Room
          </button>
        </div>
      ) : (
        <VideoCall roomUrl={roomUrl} />
      )}
    </div>
  );
};

export default VideoCallSetup;
