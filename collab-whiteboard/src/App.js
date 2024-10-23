import React, { useEffect, useState } from 'react';
import Whiteboard from './widgets/Whiteboard';
import Form from './widgets/Form';
import "./App.css"; 
import io from 'socket.io-client';
import {Route, Routes} from "react-router-dom";
const socket = io('https://server-repo-production-0508.up.railway.app/');
function App() {
  const[user,setUser]=useState(null);
  useEffect(()=>{
       socket.on("userIsJoined",(data)=>{
        if(data.success){
          console.log("userJoined");
        }
        else console.log("userJoined error");
       });
  },[]);
  const uuid=()=>{
    let S4 = () =>{
      return(((1+Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
  return(
    S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4()
  );
  };
  return (
    <div className="container">
    <Routes>
    //  <Route path="/" element={<Form uuid={uuid} socket={socket} setUser={setUser}></Form>}></Route>
      <Route path="/:roomId" element={<Whiteboard socket={socket}></Whiteboard>}></Route>

    </Routes>
    </div>
  );
}

export default App;