import React, { useEffect, useRef, useState } from 'react';
import SocketIOClient from 'socket.io-client';

const App = () => {
  const socket = useRef(null);
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState("");
  const [online, setOnline] = useState(false);
  const [messages, setMessages] = useState([]);
  const [transportType, setTransportType] = useState("none");

  const handleUserNameChange = event => {
    setUserName(() => event.target.value);
  }

  const handleMessageChange = event => {
    setMessage(() => event.target.value);
  }

  const handleMessages = (msg) => {
    setMessages(messages => [...messages, msg]);
  }

  const handleConnect = () => {
    setOnline(true);
  }

  const handleDisconnect = () => {
    setOnline(false);
  }

  const handleTransportType = () => {
    setTransportType(socket.current.io.engine.transport.query.transport);
  }

  const handleSubmit = event => {
    event.preventDefault();
    setMessage("");
    socket.current.emit('chat message', {message, userName, timestamp: new Date()});
  }

  useEffect(() => {
    socket.current = SocketIOClient();

    socket.current.on("connect", handleConnect);

    socket.current.on("disconnect", () => handleDisconnect);

    socket.current.on("chat message", handleMessages);

    socket.current.onAny(handleTransportType);

    return () => {
      socket.current.removeAllListeners();
    }
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit} style={{display: "flex", alignItems: "center", gap: 8}}>
        <span style={{
          width: 16,
          height: 16,
          backgroundColor: online ? "green" : "red",
          display: "inline-block",
          borderRadius: "50%"
        }} />
        <span>{transportType}</span>
        <input type="text" value={userName} onChange={handleUserNameChange} placeholder="Username" />
        <input type="text" value={message} onChange={handleMessageChange} placeholder="Message" />
        <button type="submit">Submit</button>
      </form>
      {
        messages.map(msg => {
          const {userName, message, timestamp} = msg;
          const time = new Date(timestamp);

          return (
            <div key={timestamp + userName}>{time.getHours()}:{('0' + time.getMinutes()).slice(-2)} | {userName}: {message}</div>
          )
        })
      }
    </>
  )
}

export default App;