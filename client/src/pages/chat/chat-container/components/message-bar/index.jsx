import { useSocket } from "@/context/SocketContext";
import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { UPLOAD_FILES_ROUTE } from "@/utils/constants";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";

const MessageBar = () => {
  const emojiRef = useRef(null);
  const fileInputRef = useRef(null);
  const socket = useSocket();
  const [message, setMessage] = useState('');
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const {selectedChatType, selectedChatData, userInfo, setIsUploading, setFileUploadProgress} = useAppStore();

  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [emojiRef])

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  }

  const handleSendMessage = async () => {
    if (selectedChatType === "contact") {
      socket.emit("sendMessage", {
        sender: userInfo._id,
        recipient: selectedChatData._id,
        content: message,
        messageType: "text",
        fileUrl: undefined
      });
    } else if (selectedChatType === "channel") {
      socket.emit("send-channel-message", {
        sender: userInfo._id,
        content: message,
        messageType: "text",
        fileUrl: undefined,
        channelId: selectedChatData._id
      })
    }
    setMessage('');
  }

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  const handleAttachmentChange = async (e) => {
    try {
      const file = e.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        setIsUploading(true); 
        const response = await apiClient.post(UPLOAD_FILES_ROUTE, formData, {
          withCredentials: true,
          onUploadProgress: (data) => {
            const progress = Math.round((100 * data.loaded) / data.total);
            setFileUploadProgress(progress);
          }
        });

        if (response.status === 200 && response.data) {
          setIsUploading(false);
          if (selectedChatType === "contact") {
            socket.emit("sendMessage", {
              sender: userInfo._id,
              recipient: selectedChatData._id,
              content: undefined,
              messageType: "file",
              fileUrl: response.data.filePath
            })
          } else if (selectedChatType === "channel") {
            socket.emit("send-channel-message", {
              sender: userInfo._id,
              content: undefined,
              messageType: "file",
              fileUrl: response.data.filePath,
              channelId: selectedChatData._id
            })
          }

          setMessage('');
        }
      }
    } catch (error) {
      setIsUploading(false);
      console.log(error);
    }
  }

  return <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center mb-6 gap-6">
    <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
      <input type="text" 
      className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
      placeholder="Enter Message"
      value={message}
      onChange={(e) => setMessage(e.target.value)}/>

      <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all' onClick={handleAttachmentClick}>
        <GrAttachment className="text-2xl"/>
      </button>

      <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => handleAttachmentChange(e)}/>

      <div className="relative">
      <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all'
      onClick={() => setEmojiPickerOpen(true)}>
        <RiEmojiStickerLine className="text-2xl"/>
      </button>
      <div className="absolute bottom-16 right-0" ref={emojiRef}>
        <EmojiPicker
        open={emojiPickerOpen}
        onEmojiClick={handleAddEmoji}
        theme="dark"
        autoFocusSearch={false}/>
      </div>
      </div>
    </div>

    <button className='bg-[#8417ff] rounded-md flex items-center justify-center p-5 hover:bg-[#741bda] focus:bg-[#741bda] focus:border-none focus:outline-none focus:text-white duration-300 transition-all'
    onClick={handleSendMessage}>
      <IoSend className="text-2xl"/>
    </button>
  </div>
}

export default MessageBar;