import React from 'react';

const Message = ({ message,colour }) => {
  return (
    <>
    <br></br>
    <div
      style={{
        backgroundColor: colour,
        color: 'black',
        fontWeight: 'bold',
        padding: '10px',
        width: '100%',
        textAlign: 'center',
      }}
    >
      {message}
    </div>
    </>
  );
};

export default Message;
