import { makeAutoObservable, observable } from "mobx";
import { Socket } from "socket.io-client";
import { IMessage, IParams } from "../components/interface";

class ChatStore {
  isWrite: boolean;
  isDeleteMessage: boolean;
  socket: Socket | null;
  params: IParams;
  state: IMessage[];
  // const [users, setUsers] = useState<number>(0);
  users: number;
  message: string;

  constructor() {
    makeAutoObservable(this);
    this.isWrite = false;
    this.isDeleteMessage = false;
    this.socket = null;
    this.params = { room: "", name: "" };
    this.state = observable.array([]); // Ініціалізація як спостережуваного масиву
    this.message = "";
    this.users = 0;
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

  setParams(params: IParams) {
    this.params = params;
  }

  setState(state: IMessage[]) {
    this.state = [...state]; // Метод `replace` доступний для observable.array
  }

  addMessage(message: IMessage) {
    this.state.push(message); // Додавання елемента в масив
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
  }
}

const chatStore = new ChatStore();
export default chatStore;
