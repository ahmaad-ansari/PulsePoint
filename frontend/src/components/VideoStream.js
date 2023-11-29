import React from 'react';

const VideoStream = ({ streamUrl }) => {
  return (
    <div style={{ overflow: 'hidden', maxHeight: '100vh', maxWidth: '100vw' }}>
      <video
        style={{ width: '100%', height: 'auto' }}
        src={streamUrl}
        controls
        autoPlay
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoStream;
