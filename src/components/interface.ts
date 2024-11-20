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
  status: number;
}
interface IMessageAdmin {
  message: string;
  id: string;
}

export interface IState {
  messageAdmin: IMessageAdmin | undefined;
  message: {
    room: string;
    messages: IMessage[];
  };
  user: {
    name: string;
    room: string;
  };
}

export interface IUsersName {
  name: string;
  room: string;
  status: string;
  time: number;
  userSocketId: string;
}
