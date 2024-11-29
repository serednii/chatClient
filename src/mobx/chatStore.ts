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
  // const [userStatus, setUserStatus] = useState<IUsersName[]>([]);
  userWrite: IUserWrite[];
  userStatus: IUsersName[];

  constructor() {
    makeAutoObservable(this, {
      // usersName:false,
      // socket: false,
      // params: false,
      // state: false,
      setUsersName: action,
      setUsers: action,
      setMessage: action,
      setWrite: action,
      setDeleteMessage: action,
      setSocket: action,
      setParams: action,
      setState: action,
      addMessage: action,
      deleteMessageById: action,
      updateMessageById: action,
    });
    this.isWrite = false;
    this.isDeleteMessage = false;
    this.socket = null;
    this.params = { room: "", name: "" };
    // const [params, setParams] = useState<IParams>({ room: "", name: "" });

    this.state = []; // Ініціалізація як спостережуваного масиву
    this.message = "";
    this.users = 0;
    this.usersName = [];
    this.userWrite = [];
    this.userStatus = [];
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
    this.state.push(message); // Додавання елемента в масив
    this.state = [...this.state];
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
}

const chatStore = new ChatStore();
export default chatStore;
