export interface IUserWrite {
  name: string;
}

export interface IParams {
  room: string;
  name: string;
}

export interface IState {
  message: string;
  user: { name: string };
}

export interface IUsersName {
  name: string;
  room: string;
  status: string;
  time: number;
  userSocketId: string;
}
