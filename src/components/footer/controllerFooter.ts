import chatStore from "../../mobx/chatStore";
import {
  sendMessageToServer,
  sendWriteToServer,
} from "../socket/setDataSocket";

export const handleSubmitChat = (message: string): void => {
  if (!message) return;
  chatStore.setWrite(false);
  sendWriteToServer({
    isWrite: false,
    params: chatStore.params,
  });
  sendMessageToServer({
    message,
    params: chatStore.params,
  });
};

export const onEmojiClick = ({ emoji }: any) =>
  chatStore.setMessage(`${chatStore.message} ${emoji}`);
