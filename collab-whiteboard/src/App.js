import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import io from 'socket.io-client';
import Form from "./widgets/Form";
import Whiteboard from './widgets/Whiteboard';


//TODO: try to change this http connection with Railway internal connection
//whiteboard-server.railway.internal
//whiteboard-server

// const socket =
//   // io('https://whiteboard-server.up.railway.app/');
//   io('http://localhost:4000/');
const ws= new WebSocket('ws://localhost:4000');
function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    ws.onmessage("userIsJoined", (data) => {
      if (data.success && data.type==="userIsJoined") {
        console.log("userJoined");
      }
      else console.log("userJoined error");
    });
  }, []);
  const uuid = () => {
    let S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (
      S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4()
    );
  };
  return (
    <div className='container'>
      <div className="container">
        <Routes>
          <Route path="/" element={<Form uuid={uuid} ws={ws} setUser={setUser} ></Form>}></Route>
          <Route path="/:roomId" element={<Whiteboard ws={ws}></Whiteboard>}></Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;