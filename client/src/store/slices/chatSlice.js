
export const createChatSlice = (set, get) => ({
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessages: [],
  directMessagesContacts: [],
  isUploading: false,
  isDownloading: false,
  fileUploadProgress: 0,
  fileDownloadProgress: 0,
  channels: [],
  setChannels: (channels) => set({ channels }),
  setIsUploading: (isUploading) => set({ isUploading }),
  setIsDownloading: (isDownloading) => set({ isDownloading }),
  setFileUploadProgress: (progress) => set({ fileUploadProgress: progress }),
  setFileDownloadProgress: (progress) => set({ fileDownloadProgress: progress }),
  setSelectedChatType: (type) => set({ selectedChatType: type }),
  setSelectedChatData: (data) => set({ selectedChatData: data }),
  setSelectedChatMessages: (messages) => set({ selectedChatMessages: messages }),
  setDirectMessagesContacts: (contacts) => set({ directMessagesContacts: contacts }),
  addChannel: (channel) => {
    const channels = get().channels;
    set({ channels: [channel, ...channels] });
  },
  closeChat: () => set({ selectedChatType: undefined, selectedChatData: undefined, selectedChatMessages: [] }),
  addMessage: (message) => {
    const selectedChatMessages = get().selectedChatMessages;
    const selectedChatType = get().selectedChatType;

    set({selectedChatMessages: [...selectedChatMessages, {
      ...message,
      recipient: selectedChatType === "channel" ? message.recipient : message.recipient._id,
      sender: selectedChatType === "channel" ? message.sender : message.sender._id
    }]});
  },

  addChannelInChannelList: (message) => {
    const channels = get().channels;
    const data = channels.find(channel => channel._id === message.channelId);
    const index = channels.findIndex(channel => channel._id === message.channelId);

    if (index !== -1 && index !== undefined) {
      channels.splice(index, 1);
      channels.unshift(data);
    }
  },

  addContactsInDMContacts: (message) => {
    const userId = get().userInfo._id;
    const fromId = message.sender._id === userId ? message.recipient._id : message.sender._id;

    const fromData = message.sender._id === userId ? message.recipient : message.sender;

    const dmContactList = get().directMessagesContacts;
    const data = dmContactList.find(contact => contact._id === fromId);
    const index = dmContactList.findIndex(contact => contact._id === fromId);

    if (index !== -1 && index !== undefined) {
      dmContactList.splice(index, 1);
      dmContactList.unshift(data);
    } else {
      dmContactList.unshift(fromData);
    }

    set({directMessagesContacts: dmContactList})
  }
})