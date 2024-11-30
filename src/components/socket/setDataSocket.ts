import chatStore from "../../mobx/chatStore";
import { IParams } from "../interface";

interface ISendWrite {
  isWrite: boolean;
  params: IParams;
}

interface ISendMessage {
  message: string;
  params: IParams;
}

interface ILastMessages {
  room: string;
  startID: number;
  limit: number;
}

export const deleteMessageById = (id: number): void => {
  chatStore.socket?.emit("deleteMessageByIdServer", {
    id,
    room: chatStore.params.room,
  });
};

export const updateMessageById = (id: number, message: string): void => {
  chatStore.socket?.emit("updateMessageByIdServer", {
    id,
    room: chatStore.params.room,
    message,
  });
};

export const sendWriteToServer = (data: ISendWrite) => {
  chatStore.socket?.emit("sendWrite", data);
};

export const sendMessageToServer = (data: ISendMessage) =>
  chatStore.socket?.emit("sendMessage", data);

export const sendLeftRoomToServer = () => {
  chatStore.socket?.emit("leftRoom", { params: chatStore.params });
  chatStore.socket?.disconnect();
};

export const sendJoinToServer = (searchParams: IParams) =>
  chatStore.socket?.emit("join", searchParams);

export const sendLastMessagesServer = (getParams: ILastMessages) =>
  chatStore.socket?.emit("getPrevMessagesServer", getParams);
