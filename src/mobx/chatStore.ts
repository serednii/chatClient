import { action, makeAutoObservable, observable } from "mobx";
import { Socket } from "socket.io-client";
import {
  IMessage,
  IParams,
  IUsersName,
  IUserWrite,
} from "../components/interface";
console.log("chatStore0000000000000000000");
class ChatStore {
  isWrite: boolean;
  isDeleteMessage: boolean;
  socket: Socket | null;
  params: IParams;
  state: IMessage[];
  usersName: IUsersName[];
  users: number;
  message: string;
  userWrite: IUserWrite[];
  userStatus: IUsersName[];
  isLoadingPrevMessagesScroll: boolean;
  isLoadingPrevMessagesLoading: boolean;
  isLoadingAddMessagesFirst: boolean;
  isLoadingAddMessagesSecond: boolean;

  constructor() {
    makeAutoObservable(this, {
      setLoadingAddMessagesFirst: action,
      setLoadingAddMessagesSecond: action,
    });
    this.isWrite = false;
    this.isDeleteMessage = false;
    this.socket = null;
    this.params = { room: "", name: "" };
    this.state = []; // Ініціалізація як спостережуваного масиву
    this.message = "";
    this.users = 0;
    this.usersName = [];
    this.userWrite = [];
    this.userStatus = [];
    this.isLoadingPrevMessagesScroll = false;
    this.isLoadingPrevMessagesLoading = false;

    this.isLoadingAddMessagesFirst = false;
    this.isLoadingAddMessagesSecond = false;
  }

  setUsersName(usersName: IUsersName[]) {
    this.usersName = [...usersName];
  }

  setUsers(counter: number) {
    this.users = counter;
  }

  setMessage(message: string) {
    this.message = message;
  }

  setWrite(value: boolean) {
    this.isWrite = value;
  }

  setDeleteMessage(value: boolean) {
    this.isDeleteMessage = value;
  }

  setSocket(socket: Socket) {
    this.socket = socket;
  }

  setParams(params: any) {
    this.params = params;
  }

  setState(state: IMessage[]) {
    this.state = state;
  }

  addMessage(message: IMessage) {
    this.state = [...this.state, message]; // Додавання елемента в масив
  }

  addPrevMessages(messages: IMessage[]) {
    const newMessages = messages.filter(
      (m) => !this.state.find((e) => e.id === m.id)
    );
    this.state = [...newMessages, ...this.state]; // Додаємо нові повідомлення і оновлюємо стан
  }

  deleteMessageById(id: number) {
    this.state = this.state.filter((message) => message.id !== id);
  }

  updateMessageById(id: number, message: string) {
    const newMessages = this.state.find(
      (message: IMessage) => message.id === id
    );
    if (newMessages) {
      newMessages.message = message;
    }
    // this.state = [...this.state];
  }

  setUserWrite(userWrite: IUserWrite[]) {
    this.userWrite = userWrite;
  }

  deleteUserWrite(deleteUserWrite: string) {
    this.userWrite = this.userWrite.filter(
      (user) => user.name !== deleteUserWrite
    );
  }

  addUserWrite(name: IUserWrite) {
    this.userWrite.push(name);
  }

  setUserStatus(userStatus: IUsersName[]) {
    this.userStatus = userStatus;
  }

  setLoadingPrevMessagesScroll(value: boolean) {
    this.isLoadingPrevMessagesScroll = value;
  }

  setLoadingPrevMessagesLoading(value: boolean) {
    this.isLoadingPrevMessagesLoading = value;
  }

  setLoadingAddMessagesFirst(value: boolean) {
    this.isLoadingAddMessagesFirst = value;
  }

  setLoadingAddMessagesSecond(value: boolean) {
    this.isLoadingAddMessagesSecond = value;
  }
}

const chatStore = new ChatStore();
export default chatStore;
