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
  name: string;
  room: string;
  startID: number;
  limit: number;
}

interface INum {
  name: string;
  room: string;
  startID: number;
}

interface ILastIdViewMessage {
  user: string;
  room: string;
  id: number;
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
//відправляємо повідомлення що закінчили ввід щод знфти точки
export const sendWriteToServer = (data: ISendWrite) => {
  chatStore.socket?.emit("sendWrite", data);
};
//відправляємо повідомлення

export const sendMessageToServer = (data: ISendMessage) =>
  chatStore.socket?.emit("sendMessage", data);

export const sendLeftRoomToServer = () => {
  chatStore.socket?.emit("leftRoom", { params: chatStore.params });
  chatStore.socket?.disconnect();
};

export const sendJoinToServer = (searchParams: IParams) =>
  chatStore.socket?.emit("join", searchParams);

export const sendPrevMessagesServer = (getParams: ILastMessages) =>
  chatStore.socket?.emit("getPrevMessagesServer", getParams);

export const sendNextMessagesServer = (getParams: ILastMessages) => {
  chatStore.setBlocked(true);
  chatStore.socket?.emit("getNextMessagesServer", getParams);
};
export const sendNextPrevMessagesServer = (getParams: ILastMessages) => {
  chatStore.setBlocked(true);
  chatStore.socket?.emit("getNextPrevMessagesServer", getParams);
};

export const sendStartNum = (getParams: INum) => {
  console.log(getParams);
  chatStore.socket?.emit("sendStartNum", getParams);
};

export const sendLastViewMessagesServer = (getParams: ILastIdViewMessage) =>
  chatStore.socket?.emit("updateLastIdViewMessageServer", getParams);
