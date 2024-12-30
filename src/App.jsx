import React from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import AgoraRTC, { AgoraRTCProvider, useRTCClient } from "agora-rtc-react";
import { Suspense, useState } from 'react';
import ConnectForm from './Components/ConnectForm';
import LiveVideo from './Components/LiveVideo';
import './App.css';
import VideoCallApp from './Components/VideoCallApp';

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen">
    Loading...
  </div>
);

const NotFound = () => (
  <div className="flex flex-col items-center justify-center h-screen gap-4">
    <h1 className="text-2xl">Page Not Found</h1>
    <button
      onClick={() => window.location.href = '/'}
      className="px-4 py-2 bg-blue-500 text-white rounded-md"
    >
      Return Home
    </button>
  </div>
);

function App() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const agoraClient = useRTCClient(
    AgoraRTC.createClient({
      codec: "vp8",
      mode: "rtc"
    })
  );


  const handleConnect = async (channelName) => {
    setIsLoading(true);
    try {
      // Add any pre-connection setup here if needed
      navigate(`/via/${channelName}`);
    } catch (error) {
      console.error('Connection failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route
            path="/"
            element={
              <ConnectForm 
                connectToVideo={handleConnect}
                isLoading={isLoading}
              />
            }
          />
          <Route
            path="/app"
            element={
              <VideoCallApp 
               
              />
            }
          />
          <Route
            path="/via/:channelName"
            element={
              <AgoraRTCProvider client={agoraClient}>
                <LiveVideo />
              </AgoraRTCProvider>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;