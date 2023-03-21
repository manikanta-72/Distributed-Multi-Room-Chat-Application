import React, { useState } from 'react';
import SockJsClient from 'react-stomp';
import './App.css';
import LoginForm from './components/LoginForm';
import GroupView from './components/TabPanel/tabpanel'
import { randomColor } from './utils/common';


const SOCKET_URL = '/ws-chat/';

const App = () => {
  const [newMessage, setNewMessage] = useState(null)
  const [user, setUser] = useState(null)

  let onConnected = () => {
    console.log("Connected!!")
  }

  let onMessageReceived = (msg) => {
    setNewMessage(msg);
  }

  let handleLoginSubmit = (username) => {
    console.log(username, " Logged in..");

    setUser({
      username: username,
      color: randomColor()
    })

  }

  return (
    <div className="App">
      {!!user ?
        (
          <>
            <SockJsClient
              url={SOCKET_URL}
              topics={['/topic/group']}
              onConnect={onConnected}
              onDisconnect={console.log("Disconnected!")}
              onMessage={msg => onMessageReceived(msg)}
              debug={false}
            />
            <GroupView user={user} newMessage={newMessage} />
          </>
        ) :
        <LoginForm onSubmit={handleLoginSubmit} />
      }
    </div>
  )
}

export default App;
