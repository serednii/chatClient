import chatStore from "../../mobx/chatStore";

export const deleteMessageById = (id: number): void => {
  if (chatStore.socket) {
    chatStore.socket.emit("deleteMessageByIdServer", {
      id,
      room: chatStore.params.room,
    });
  }
};

export const updateMessageById = (id: number, message: string): void => {
  if (chatStore.socket) {
    chatStore.socket.emit("updateMessageByIdServer", {
      id,
      room: chatStore.params.room,
      message,
    });
  }
};
