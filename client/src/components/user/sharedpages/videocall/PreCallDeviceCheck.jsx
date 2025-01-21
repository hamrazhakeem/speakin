import React, { useState, useEffect } from 'react';
import useAxios from '../../../../hooks/useAxios';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  VideoIcon, 
  TimerIcon, 
  WalletIcon, 
  Wifi, 
  Mic, 
  Camera,
  Volume2
} from 'lucide-react';
import PrimaryButton from '../../common/ui/buttons/PrimaryButton';
import FormInput from '../../common/ui/input/FormInput';
import DeviceStatus from './DeviceStatus';

const PreCallDeviceCheck = () => {
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
      if (!roomName.trim()) {
        setError("Please enter a room name");
        return;
      }
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
  

    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white shadow-xl rounded-2xl p-8 space-y-8">
              {/* Header */}
              <div className="text-center">
                <VideoIcon className="mx-auto h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-2xl font-bold text-gray-800">Join Video Call Room</h3>
                <p className="text-gray-500 mt-2">Please check your devices before joining the session</p>
              </div>
  
              {/* Device Status Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DeviceStatus icon={Camera} label="Camera" status={deviceStatus.camera} />
                <DeviceStatus icon={Mic} label="Microphone" status={deviceStatus.microphone} />
                <DeviceStatus icon={Volume2} label="Speaker" status={deviceStatus.speaker} />
                <DeviceStatus icon={Wifi} label="Internet Connection" status={deviceStatus.internet} />
              </div>
  
              {/* Room Name Input */}
              <div className="space-y-4">
                <FormInput
                  label="Room Name"
                  value={roomName}
                  onChange={(e) => {
                    setRoomName(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter room name"
                  error={error}
                />
              </div>
  
              {/* Join Button */}
              <PrimaryButton
                onClick={createRoom}
                loading={joiningSession}
                disabled={Object.values(deviceStatus).some(status => status === 'error') || joiningSession}
                className="w-full"
              >
                {joiningSession ? 'Joining Session...' : 'Join Session'}
              </PrimaryButton>
  
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
        </div>
      </div>
    );
  };
  
  export default PreCallDeviceCheck;