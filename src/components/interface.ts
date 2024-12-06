export interface IUserWrite {
  name: string;
}

export interface IParams {
  room: string;
  name: string;
}

export interface IMessage {
  author: string;
  date: string;
  id: number;
  message: string;
  room: string;
}

interface IMessageAdmin {
  message: string;
  id: string;
}

export interface IState {
  // messageAdmin: IMessageAdmin | undefined;
  message: {
    room: string;
    messages: IMessage[];
  };
  user: {
    name: string;
    room: string;
  };
}

interface IUser {
  author: string;
  date: number;
  userSocketId: string;
  id: number;
}

export interface IData {
  viewMessageId: number;
  firstMessageId: number;
  lastMessageId: number;
  unreadMessagesCount: number;
}
export interface IMessageStart {
  messages: IMessage[];
  data: IData;
}

export interface IMessageAdd {
  message: IMessage;
  data: IData;
}

export interface IMessagesAdd {
  messages: IMessage[];
  data: IData;
}

export interface IMessageNext {
  message: {
    room: string;
    messages: IMessage[];
  };
  user: IUser;
}

export interface IUsersName {
  name: string;
  room: string;
  status: string;
  time: number;
  userSocketId: string;
}
