import { useEffect, useRef, useState } from "react";
import { CardHeader } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import {
  addLastIdMessageViewLocalStorage,
  getLastIdMessageViewLocalStorage,
} from "../../localStorage/localStorage";
import chatStore from "../../mobx/chatStore";
import infoStore from "../../mobx/infoStore";
import {
  IMessage,
  IMessageAdd,
  IMessageStart,
  IParams,
  IUserWrite,
} from "../interface";
import { sendJoinToServer } from "./setDataSocket";
import useWebSocket from "./useWebsocket";

const useJoin = () => {
  const hasJoined = useRef(false);
  const { search } = useLocation();
  const [joinStatus, setJoinStatus] = useState("not_joined");

  useEffect(() => {
    if (!chatStore.socket) {
      console.error("Socket is not defined");
      return;
    }

    if (!hasJoined.current) {
      console.log("JOIN----------------------------", search);
      const searchParamsObj = Object.fromEntries(new URLSearchParams(search));
      const searchParams: IParams = {
        name: searchParamsObj.name || "",
        room: searchParamsObj.room || "",
      };
      if (searchParams.name && searchParams.room) {
        chatStore.setParams(searchParams);
        sendJoinToServer(searchParams);
        hasJoined.current = true; // Позначаємо, що користувач уже приєднався
        setJoinStatus("joined");
      } else {
        setJoinStatus("error");
        console.error("Missing required search parameters: name and/or room.");
      }
    }
  }, [chatStore.socket, search]);
  return { joinStatus };
};

const useMessageStart = () => {
  useEffect(() => {
    const handleMessageStart = ({ messages, data }: IMessageStart) => {
      console.log("messageStart----------------------------", messages);
      const lastMessageId = messages?.at(-2)?.id;
      // if (!getLastIdMessageViewLocalStorage()) {
      //   addLastIdMessageViewLocalStorage(lastMessageId);
      // }

      if (messages && data) {
        chatStore.setState(messages);
        const startId =
          messages.at(-1) &&
          messages[messages.length - 1].id -
            (data.lastMessageId - data.viewMessageId);
        chatStore.setAddedMessageToLastUserRef(startId || messages[0].id);
      }
    };
    chatStore.socket?.on("messageStart", handleMessageStart);
    return () => {
      chatStore.socket?.off("messageStart", handleMessageStart);
    };
  }, [chatStore.socket, chatStore.state]);
  return {};
};

const useMessageAdd = () => {
  useEffect(() => {
    const handleMessageAdd = ({ message, data }: IMessageAdd) => {
      // console.log("useMessageAdd-=-=-=-=-***************---------", message);
      if (message) {
        chatStore.addMessage(message);
        if (message.author === chatStore.params.name) {
          chatStore.setLoadingAddMessagesFirst(true);
        }
        // chatStore.setLoadingAddMessagesSecond(true);
      }
      if (data) {
        chatStore.setDataMessagesId(data);
      }
    };
    chatStore.socket?.on("messageAdd", handleMessageAdd);
    return () => {
      chatStore.socket?.off("messageAdd", handleMessageAdd);
    };
  }, [chatStore.socket, chatStore.state]);
  return {};
};

const usePrevMessageAdd = () => {
  useEffect(() => {
    const handlePrevMessageAdd = ({ messages, data }: IMessageStart) => {
      // console.log("handlePrevMessageAdd-----ZZZZZZZZZZ------", messages);
      if (messages && messages.length !== 0) {
        // chatStore.setLoadingPrevMessagesScroll(true);
        chatStore.addPrevMessages(messages);
        // setTimeout(() => {
        //   chatStore.setLoadingPrevMessagesLoading(false);
        //   chatStore.setLoadingPrevMessagesScroll(false);
        // }, 1050);
      }
    };

    chatStore.socket?.on("prevMessagesUser", handlePrevMessageAdd);
    return () => {
      chatStore.socket?.off("prevMessagesUser", handlePrevMessageAdd);
    };
  }, [chatStore.socket, chatStore.state]);
  return {};
};

const useNextMessageAdd = () => {
  useEffect(() => {
    const handleNextMessageAdd = ({ messages, data }: IMessageStart) => {
      // console.log("handlePrevMessageAdd-----ZZZZZZZZZZ------", messages);
      if (messages && messages.length !== 0) {
        chatStore.addNextMessages(messages);
        chatStore.setAddedMessageToLastUserRef(messages[0].id);
        // chatStore.setLoadingNextMessagesScroll(true);
        // chatStore.setLoadingDataFuncReturn(true);
        // setTimeout(() => {
        //   chatStore.setLoadingNextMessagesLoading(false);
        //   chatStore.setLoadingNextMessagesScroll(false);
        // }, 1050);
      }
    };

    chatStore.socket?.on("nextMessagesUser", handleNextMessageAdd);
    return () => {
      chatStore.socket?.off("nextMessagesUser", handleNextMessageAdd);
    };
  }, [chatStore.socket, chatStore.state]);
  return {};
};

const useMessagesStatus = () => {
  useEffect(() => {
    const handleStatusMessage = ({ data }: any) => {
      chatStore.setUserStatus(data?.roomUsers);
    };
    chatStore.socket?.on("messageStatus", handleStatusMessage);
    return () => {
      chatStore.socket?.off("messageStatus", handleStatusMessage);
    };
  }, [chatStore.socket]);
  return {};
};

const useMessageWrite = () => {
  useEffect(() => {
    const handleStatusMessageWrite = ({ data }: any) => {
      const { isWrite, user } = data;

      //Якщо то ми набираємо текст то нічого не робимо
      if (user.name === chatStore.params.name) {
        return;
      }
      //Находимо користувача в масиві
      const isUser: IUserWrite | undefined = chatStore.userWrite.find(
        (_user: IUserWrite) => _user.name === user.name
      );

      //маємо добавити в масив нового користувача який набирає текст
      if (isWrite) {
        //Добавляємо нового який набирає текст
        // console.log("Добавляємо нового який набирає текст");
        if (!isUser) {
          // console.log(chatStore.userWrite);
          chatStore.addUserWrite({ name: user.name });
        }
      } else {
        //Видаляємо користувача який набирає текст
        if (isUser) {
          chatStore.deleteUserWrite(user.name);
        }
      }
    };
    chatStore.socket?.on("messageWrite", handleStatusMessageWrite);
    return () => {
      chatStore.socket?.off("messageWrite", handleStatusMessageWrite);
    };
  }, [chatStore.socket]);
  return {};
};

const useMessageRoom = () => {
  useEffect(() => {
    const handleRoom = ({ data: { users } }: any) => {
      chatStore.setUsers(users.length);
      chatStore.setUsersName(users);
    };
    chatStore.socket?.on("room", handleRoom);
    return () => {
      chatStore.socket?.off("room", handleRoom);
    };
  }, [chatStore.socket]);
  return {};
};

const useDeleteMessageByIdUser = () => {
  useEffect(() => {
    const handleDeleteMessageByIdUser = ({ id }: any) => {
      chatStore.deleteMessageById(id);
    };
    chatStore.socket?.on("deleteMessageByIdUser", handleDeleteMessageByIdUser);
    return () => {
      chatStore.socket?.off(
        "deleteMessageByIdUser",
        handleDeleteMessageByIdUser
      );
    };
  }, [chatStore.socket, chatStore.state]);
  return {};
};

const useUpdateMessageByIdUser = () => {
  useEffect(() => {
    const handleUpdateMessageByIdUUser = ({ id, message }: any) => {
      if (chatStore.state) {
        chatStore.updateMessageById(id, message);
      }
    };
    chatStore.socket?.on("updateMessageByIdUser", handleUpdateMessageByIdUUser);
    return () => {
      chatStore.socket?.off(
        "updateMessageByIdUser",
        handleUpdateMessageByIdUUser
      );
    };
  }, [chatStore.socket, chatStore.state]);
  return {};
};

const useConnectHooks = () => {
  useWebSocket();
  //При вході користувача  приймаємо імя і кімнату
  useJoin();
  useMessageStart();
  useMessageAdd();
  useNextMessageAdd();
  useMessagesStatus();
  useMessageWrite();
  useMessageRoom();
  useDeleteMessageByIdUser();
  useUpdateMessageByIdUser();
  usePrevMessageAdd();
  return {};
};

export default useConnectHooks;
