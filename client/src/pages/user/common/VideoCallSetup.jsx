import React, { useState, useEffect } from "react";
import useAxios from "../../../hooks/useAxios";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  VideoIcon, 
  TimerIcon, 
  AlertTriangleIcon, 
  WalletIcon, 
  Wifi, 
  Mic, 
  Camera,
  Volume2
} from "lucide-react";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

const VideoCallSetup = () => {
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState("");
  const [error, setError] = useState("");
  const [deviceStatus, setDeviceStatus] = useState({
    camera: 'checking',
    microphone: 'checking',
    speaker: 'checking',
    internet: 'checking'
  });
  const location = useLocation();
  const { bookingId } = location.state || {};
  const [joiningSession, setJoiningSession] = useState(false);

  useEffect(() => {
    checkDevices();
    checkInternetConnection();
  }, []);

  const checkDevices = async () => {
    try {
      // Check camera and microphone permissions
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      
      // Check camera
      const videoTracks = stream.getVideoTracks();
      setDeviceStatus(prev => ({
        ...prev,
        camera: videoTracks.length > 0 ? 'ready' : 'error'
      }));

      // Check microphone
      const audioTracks = stream.getAudioTracks();
      setDeviceStatus(prev => ({
        ...prev,
        microphone: audioTracks.length > 0 ? 'ready' : 'error'
      }));

      // Check speakers
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      if (audioContext.state === 'running') {
        setDeviceStatus(prev => ({
          ...prev,
          speaker: 'ready'
        }));
      }

      // Clean up
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      console.error('Error checking devices:', err);
      setDeviceStatus(prev => ({
        ...prev,
        camera: 'error',
        microphone: 'error'
      }));
    }
  };

  const checkInternetConnection = () => {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const updateConnectionStatus = () => {
      setDeviceStatus(prev => ({
        ...prev,
        internet: navigator.onLine ? 'ready' : 'error'
      }));
    };

    updateConnectionStatus();
    window.addEventListener('online', updateConnectionStatus);
    window.addEventListener('offline', updateConnectionStatus);

    return () => {
      window.removeEventListener('online', updateConnectionStatus);
      window.removeEventListener('offline', updateConnectionStatus);
    };
  };

  const createRoom = async () => {
    // Check if all devices are ready
    const hasDeviceErrors = Object.values(deviceStatus).some(status => status === 'error');
    if (hasDeviceErrors) {
      setError("Please ensure all devices are working properly before joining");
      return;
    }

    setJoiningSession(true); // Start loading
    try {
      const response = await axiosInstance.post("create-daily-room/", {
        room_name: roomName.trim(),
      });
      
      const { room, token } = response.data;
      const roomUrlWithToken = `${room.url}?t=${token}`;
      await axiosInstance.patch(`bookings/${bookingId}/`, {
        booking_status: 'ongoing'
      });
      navigate('/video-call', { 
        state: { 
          roomUrl: roomUrlWithToken,
          bookingId: bookingId
        } 
      });
    } catch (error) {
      console.error("Room creation failed", error);
      setError("Failed to create room. Please try again.");
    } finally {
      setJoiningSession(false); // End loading
    }
  };

  const getDeviceStatusColor = (status) => {
    switch (status) {
      case 'ready':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-yellow-500';
    }
  };

  const renderDeviceStatus = (icon, label, status) => (
    <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
      {React.createElement(icon, { 
        className: `w-5 h-5 ${getDeviceStatusColor(deviceStatus[status])}` 
      })}
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <span className={`ml-auto text-sm font-medium ${getDeviceStatusColor(deviceStatus[status])}`}>
        {deviceStatus[status] === 'ready' ? 'Ready' : deviceStatus[status] === 'error' ? 'Error' : 'Checking...'}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-8 space-y-8">
        <div className="text-center">
          <VideoIcon className="mx-auto h-12 w-12 text-blue-600 mb-4" />
          <h3 className="text-2xl font-bold text-gray-800">Join Video Call Room</h3>
          <p className="text-gray-500 mt-2">Please check your devices before joining the session</p>
        </div>

        {/* Device Status Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-6 rounded-xl">
          {renderDeviceStatus(Camera, 'Camera', 'camera')}
          {renderDeviceStatus(Mic, 'Microphone', 'microphone')}
          {renderDeviceStatus(Volume2, 'Speaker', 'speaker')}
          {renderDeviceStatus(Wifi, 'Internet Connection', 'internet')}
        </div>

        {/* Room Name Input */}
        <div className="space-y-4">
          <label htmlFor="roomName" className="block text-sm font-medium text-gray-700">
            Room Name
          </label>
          <input
            id="roomName"
            type="text"
            required
            value={roomName}
            onChange={(e) => {
              setRoomName(e.target.value);
              setError("");
            }}
            placeholder="Enter room name"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl
                     focus:outline-none focus:ring-2 focus:ring-blue-500 
                     focus:border-transparent transition duration-300"
          />
          {error && (
            <p className="text-red-500 text-sm mt-2 flex items-center">
              <AlertTriangleIcon className="w-4 h-4 mr-2" />
              {error}
            </p>
          )}
        </div>

        <button 
          onClick={createRoom} 
          disabled={Object.values(deviceStatus).some(status => status === 'error') || joiningSession}
          className={`w-full py-4 rounded-xl flex items-center justify-center space-x-2
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                     ${Object.values(deviceStatus).some(status => status === 'error') || joiningSession
                       ? 'bg-blue-500 cursor-not-allowed'
                       : 'bg-blue-600 hover:bg-blue-700 text-white'} 
                     transition duration-300`}
        >
          {joiningSession ? (
            <div className="flex items-center justify-center">
              <LoadingSpinner size="sm" className="text-white" />
              <span className="ml-2 text-white">Joining Session...</span>
            </div>
          ) : (
            <>
              <VideoIcon className="h-5 w-5 mr-2" />
              Join Session
            </>
          )}
        </button>

        {/* Guidelines Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-xl space-y-3">
            <div className="flex items-center">
              <TimerIcon className="h-6 w-6 text-yellow-600 mr-2" />
              <h4 className="font-semibold text-yellow-800">Session Guidelines</h4>
            </div>
            <ul className="text-sm text-yellow-700 list-disc list-inside space-y-2">
              <li>Ensure stable internet connection</li>
              <li>Use headphones for better audio</li>
              <li>Find a quiet, well-lit environment</li>
              <li>Keep your camera on during the session</li>
            </ul>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-xl space-y-3">
            <div className="flex items-center">
              <WalletIcon className="h-6 w-6 text-blue-600 mr-2" />
              <h4 className="font-semibold text-blue-800">Technical Support</h4>
            </div>
            <ul className="text-sm text-blue-700 list-disc list-inside space-y-2">
              <li>Check browser permissions</li>
              <li>Close other video applications</li>
              <li>Refresh page if issues persist</li>
              <li>Contact support if needed</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCallSetup;