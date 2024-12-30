import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  LocalUser,
  RemoteUser,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRemoteAudioTracks,
  useRemoteUsers,
} from "agora-rtc-react";

const LiveVideo = () => {
  const appId = process.env.REACT_APP_AGORA_APP_ID;
  const { channelName } = useParams();
  const navigate = useNavigate();

  const [activeConnection, setActiveConnection] = useState(true);
  const [micOn, setMic] = useState(true);
  const [cameraOn, setCamera] = useState(true);
  const [error, setError] = useState(null);

  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn);

  const { isLoading: isJoining, error: joinError } = useJoin(
    {
      appid: appId,
      channel: channelName,
      token: null, // Replace with your token generation logic
    },
    activeConnection
  );

  usePublish([localMicrophoneTrack, localCameraTrack]);

  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);

  useEffect(() => {
    if (joinError) {
      setError("Failed to join the channel. Please try again.");
    }
  }, [joinError]);

  useEffect(() => {
    audioTracks.forEach((track) => track.play());
    
    return () => {
      audioTracks.forEach((track) => track.stop());
      localMicrophoneTrack?.close();
      localCameraTrack?.close();
    };
  }, [audioTracks, localMicrophoneTrack, localCameraTrack]);

  const handleDisconnect = () => {
    setActiveConnection(false);
    navigate('/');
  };

  if (isJoining) {
    return <div className="flex items-center justify-center h-screen">Connecting to channel...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <div id="remoteVideoGrid" className="grid grid-cols-2 gap-4 flex-grow p-4">
        {remoteUsers.map((user) => (
          <div key={user.uid} className="relative rounded-lg overflow-hidden bg-gray-800">
            <RemoteUser user={user} />
          </div>
        ))}
      </div>

      <div id="localVideo" className="relative h-48 bg-gray-900">
        <LocalUser
          audioTrack={localMicrophoneTrack}
          videoTrack={localCameraTrack}
          cameraOn={cameraOn}
          micOn={micOn}
          playAudio={micOn}
          playVideo={cameraOn}
          className="h-full w-full"
        />

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div id="controlsToolbar" className="flex justify-between items-center bg-gray-800 rounded-lg p-3">
            <div id="mediaControls" className="flex gap-3">
              <button
                className={`px-4 py-2 rounded-md ${micOn ? 'bg-blue-500' : 'bg-red-500'} text-white`}
                onClick={() => setMic(a => !a)}
              >
                {micOn ? 'Mic On' : 'Mic Off'}
              </button>
              <button
                className={`px-4 py-2 rounded-md ${cameraOn ? 'bg-blue-500' : 'bg-red-500'} text-white`}
                onClick={() => setCamera(a => !a)}
              >
                {cameraOn ? 'Camera On' : 'Camera Off'}
              </button>
            </div>
            <button
              id="endConnection"
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              onClick={handleDisconnect}
            >
              Disconnect
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveVideo;