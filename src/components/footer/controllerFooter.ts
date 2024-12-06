import chatStore from "../../mobx/chatStore";
import {
  sendMessageToServer,
  sendWriteToServer,
} from "../socket/setDataSocket";

export const handleSubmitChat = (message: string): void => {
  if (!message) return;

  //відправляємо повідомлення що закінчили ввід щод знфти точки
  chatStore.setWrite(false);
  sendWriteToServer({
    isWrite: false,
    params: chatStore.params,
  });

  //відправляємо повідомлення
  sendMessageToServer({
    message,
    params: chatStore.params,
  });
};

export const handleChangeChat = () => {
  if (!chatStore.isWrite) {
    sendWriteToServer({
      isWrite: true,
      params: chatStore.params,
    });
    chatStore.setWrite(true);
  }
};

export const onEmojiClick = ({ emoji }: any) =>
  chatStore.setMessage(`${chatStore.message} ${emoji}`);
