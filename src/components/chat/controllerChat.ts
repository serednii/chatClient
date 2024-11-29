import chatStore from "../../mobx/chatStore";
import {
  sendMessageToServer,
  sendWriteToServer,
} from "../socket/setDataSocket";

export const clearSetWrite = (): void => {
  chatStore.setWrite(false);
  sendWriteToServer({
    isWrite: false,
    params: chatStore.params,
  });
};
