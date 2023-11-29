import React, { useState, useEffect } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';

const App = () => {
  const [message, setMessage] = useState();
  const [connection, setConnection] = useState(null);

  useEffect(async () => {
   const a= await connect();
  }, []);

  const connect = async () => {
    try {
      const newConnection = await new HubConnectionBuilder()
        .withUrl('https://noti-service.onrender.com/NotiHub') // Thay thế bằng URL của ứng dụng ASP.NET Core của bạn
        .withAutomaticReconnect()
        .build();
      newConnection.on('GetListNoti', (message) => {
        setMessage(message);
        //console.log("GetListNoti: ", message)
      })
      newConnection.onclose(e => {
        setConnection();
      });
      //console.log("newconnection:", newConnection)
      await newConnection.start();
      await newConnection.invoke("UpdateUser", 'user');
      await newConnection.invoke("ConnectUser");
      setConnection(newConnection);
      //console.log("build thanh cong, newconnection:", newConnection)
      setConnection(newConnection);
    }
    catch (e) {
      console.log(e);
    }
  }

  const disconnect = async () => {
    try {
      if (connection) { await connection.stop(); }
      setMessage();
    }
    catch (e) { console.log(e) }

  }
  
return (
  <div>
    <ul>
      {message}
    </ul>
    <div>
      <button onClick={() => connect()}>Connect</button>
      <button onClick={() => disconnect()}>disconnect</button>
    </div>
  </div>
);
};

export default App;
