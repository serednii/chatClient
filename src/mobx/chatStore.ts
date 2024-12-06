import { action, makeAutoObservable, observable } from "mobx";
import { Socket } from "socket.io-client";
import {
  IMessage,
  IParams,
  IUsersName,
  IUserWrite,
  IData,
} from "../components/interface";

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
  isLoadingMessage: boolean;
  isLoadingPrevMessagesLoading: boolean;
  isLoadingNextMessagesLoading: boolean;
  isLoadingNextMessagesScroll: boolean;
  lastNumberViewMessages: number;
  isBlocked: boolean;
  activeRef: HTMLLIElement | null;
  arrayLastUserRef: (HTMLLIElement | null)[];
  isLoadingMessagesStartId: number | null;
  dataMessagesId: IData | null | undefined;
  // isLoadingPrevMessagesScroll: boolean;
  // isLoadingAddMessagesSecond: boolean;
  isLoadingPrevNextMessages: boolean;

  constructor() {
    makeAutoObservable(this, {
      setLoadingMessage: action,
      // setLoadingAddMessagesSecond: action,
      setArrayLastUserRef: action,
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
    this.isLoadingPrevMessagesLoading = false;
    this.isLoadingNextMessagesScroll = false;
    this.isLoadingNextMessagesLoading = false;
    this.isLoadingMessage = false;
    this.lastNumberViewMessages = 1;
    this.isBlocked = false;
    this.activeRef = null;
    this.arrayLastUserRef = [];
    this.isLoadingMessagesStartId = null;
    this.dataMessagesId = null;
    // this.isLoadingPrevMessagesScroll = false;
    // this.isLoadingAddMessagesSecond = false;
    this.isLoadingPrevNextMessages = false;
  }

  setDataMessagesId(data: IData | null | undefined) {
    console.log("DDDDDDD", data);
    this.dataMessagesId = data;
  }

  setLoadingMessagesStartId(value: number | null) {
    this.isLoadingMessagesStartId = value;
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

  addMessageState(message: IMessage) {
    const fullMessage: IMessage[] = [...this.state, message];
    if (fullMessage.length > 300) {
      fullMessage.splice(0, 50);
    }
    this.state = fullMessage; // Додаємо нові повідомлення і оновлюємо стан
  }
  filterUniqueMessages(messages: IMessage[]): IMessage[] {
    const newMessages: IMessage[] = messages.filter(
      (m) => !this.state.find((e) => e.id === m.id)
    );
    return newMessages;
  }

  deleteMessagesRef(messages: IMessage[]) {
    this.arrayLastUserRef = this.arrayLastUserRef.filter((m) => {
      const idString: string | null | undefined = m?.getAttribute("data-id");
      let idNumber: number = 0;
      if (idString) {
        idNumber = parseInt(idString);
        return !messages.find((m) => m.id === idNumber);
      }
      return true;
    });
  }

  addPrevMessages(messages: IMessage[]) {
    const newMessages: IMessage[] = this.filterUniqueMessages(messages);
    const fullMessage: IMessage[] = [...newMessages, ...this.state];
    if (fullMessage.length > 300) {
      console.log("HHHHHHH", [...messages]);
      this.state = fullMessage.slice(0, -50); //Видаляємо нові повідомлення

      this.deleteMessagesRef(fullMessage.slice(-50));
    } else {
      this.state = fullMessage; // Додаємо нові повідомлення і оновлюємо стан
    }
  }

  addNextMessages(messages: IMessage[]) {
    const newMessages: IMessage[] = this.filterUniqueMessages(messages);
    const fullMessage: IMessage[] = [...this.state, ...newMessages];
    if (fullMessage.length > 300) {
      fullMessage.splice(0, 50); //Видаляємо старі повідомлення
    }
    this.state = fullMessage; // Додаємо нові повідомлення і оновлюємо стан
  }

  addMessages(messages: IMessage[]) {
    this.state = messages; // Додаємо нові повідомлення і оновлюємо стан
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

  // setLoadingPrevMessagesScroll(value: boolean) {
  //   this.isLoadingPrevMessagesScroll = value;
  // }

  setLoadingNextMessagesScroll(value: boolean) {
    this.isLoadingNextMessagesScroll = value;
  }

  // setLoadingDataFuncReturn(value: boolean) {
  //   this.isLoadingDataFuncReturn = value;
  // }

  setLoadingNextMessagesLoading(value: boolean) {
    this.isLoadingNextMessagesLoading = value;
  }
  setLoadingPrevMessagesLoading(value: boolean) {
    this.isLoadingPrevMessagesLoading = value;
  }
  setLoadingMessage(value: boolean) {
    this.isLoadingMessage = value;
  }

  setLoadingPrevNextMessages(value: boolean) {
    this.isLoadingPrevNextMessages = value;
  }

  setLastNumberViewMessages(value: number) {
    this.lastNumberViewMessages = value;
  }

  setBlocked(value: boolean) {
    this.isBlocked = value;
  }

  setActiveRef(value: HTMLLIElement | null) {
    this.activeRef = value;
  }

  setArrayLastUserRef(value: (HTMLLIElement | null)[]) {
    this.arrayLastUserRef = value;
  }

  addArrayLastUserRef(value: HTMLLIElement | null) {
    if (this.arrayLastUserRef.find((e) => e === value)) {
      return;
    }
    this.arrayLastUserRef.push(value);
  }

  deleteFirstElementArrayLastUserRef() {
    return this.arrayLastUserRef.shift();
  }
}

const chatStore = new ChatStore();
export default chatStore;
