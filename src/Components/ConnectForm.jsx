import { useState } from 'react';
import PropTypes from 'prop-types';

const ConnectForm = ({ connectToVideo, isLoading }) => {
  const [channelName, setChannelName] = useState('');
  const [invalidInputMsg, setInvalidInputMsg] = useState('');

  const validateChannelName = (name) => {
    if (name === '') {
      return "Channel name can't be empty.";
    }
    if (!/^[a-zA-Z0-9-_]+$/.test(name)) {
      return "Only letters, numbers, hyphens and underscores allowed.";
    }
    if (name.length > 32) {
      return "Channel name too long (max 32 characters).";
    }
    return '';
  };

  const handleConnect = (e) => {
    e.preventDefault();
    const trimmedChannelName = channelName.trim();
    const errorMsg = validateChannelName(trimmedChannelName);
    
    if (errorMsg) {
      setInvalidInputMsg(errorMsg);
      if (trimmedChannelName === '') {
        setChannelName('');
      }
      return;
    }

    connectToVideo(trimmedChannelName);
  };

  return (
    <form onSubmit={handleConnect} className="flex flex-col items-center gap-4">
      <img 
        src="/api/placeholder/100/100"
        className="w-16 h-16"
        alt="logo"
      />
      <div className="flex flex-col gap-3">
        <input
          id="channelName"
          type="text"
          placeholder="Channel Name"
          value={channelName}
          onChange={(e) => {
            setChannelName(e.target.value);
            setInvalidInputMsg('');
          }}
          disabled={isLoading}
          className="px-4 py-2 border rounded-md disabled:bg-gray-100"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isLoading ? 'Connecting...' : 'Connect'}
        </button>
        {invalidInputMsg && (
          <p className="text-red-500 text-sm">
            {invalidInputMsg}
          </p>
        )}
      </div>
    </form>
  );
};

ConnectForm.propTypes = {
  connectToVideo: PropTypes.func.isRequired,
  isLoading: PropTypes.bool
};

export default ConnectForm;