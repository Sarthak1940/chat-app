import { useAppStore } from '@/store';
import { BACKEND_URL } from '@/utils/constants';
import { createContext, useContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
}

export const SocketProvider = ({children}) => {
  const socket = useRef(null);
  const {userInfo} = useAppStore();

  useEffect(() => {
    if (userInfo) {
      socket.current = io(BACKEND_URL, {
        withCredentials: true,
        query: {
          userId: userInfo._id
        }
      })
      
      socket.current.on("connect", () => {
        console.log("Socket connected");
      })

      const handleRecieveMessage = (message) => {
        const {selectedChatData, selectedChatType, addMessage, addContactsInDMContacts} = useAppStore.getState();

        if (selectedChatType !== undefined && (selectedChatData._id === message.sender._id || 
          selectedChatData._id === message.recipient._id)) {
          addMessage(message);
        }
        
        addContactsInDMContacts(message);

      }

      const handleRecieveChannelMessage = (message) => {
        const {selectedChatData, selectedChatType, addMessage, addChannelInChannelList} = useAppStore.getState();

        if (selectedChatType !== undefined && selectedChatData._id === message.channelId) {
          addMessage(message);
        }
        addChannelInChannelList(message)
      }

      socket.current.on("recieveMessage", handleRecieveMessage);
      socket.current.on("recieve-channel-message", handleRecieveChannelMessage);

      return () => {
        socket.current.disconnect();
      }
    }
  }, [userInfo])

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  )
}