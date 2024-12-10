import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import chatStore from "../../mobx/chatStore";
import {
  IData,
  IMessageAdd,
  IMessagesAdd,
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
      // console.log("messageStart----------------------------", messages);

      if (messages && data) {
        chatStore.setState(messages);
        chatStore.setDataMessagesId(data);
        // console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", data);
        chatStore.setLoadingMessagesStartId(true);
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
      // console.log(
      //   "useMessageAdd-=-=-=-=-***************---------",
      //   message,
      //   data
      // );
      if (message && data && chatStore.dataMessagesId) {
        chatStore.setLoadingMessage(true);
        chatStore.addMessageState(message);

        data.viewMessageId = chatStore.dataMessagesId.viewMessageId;
        data.unreadMessagesCount = chatStore.dataMessagesId.unreadMessagesCount;
        if (message.author !== "Admin") {
          if (message.author === chatStore.params.name) {
            //if user added message
            if (data.unreadMessagesCount === 0) {
              data.viewMessageId = data.lastMessageId;
            }
          } else {
            data.unreadMessagesCount++;
          }
        }
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
    const handlePrevMessageAdd = ({ messages, data }: IMessagesAdd) => {
      if (data) {
        data.viewMessageId = chatStore.dataMessagesId?.viewMessageId || 1;
      }
      // console.log("handlePrevMessageAdd-----ZZZZZZZZZZ------", messages);
      if (messages && messages.length !== 0) {
        // chatStore.setLoadingPrevMessagesScroll(true);
        chatStore.addPrevMessages(messages);
        setTimeout(() => {
          chatStore.setLoadingPrevMessagesLoading(false);
          // chatStore.setLoadingPrevMessagesScroll(false);
        }, 1000);
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
    const handleNextMessageAdd = ({ messages, data }: IMessagesAdd) => {
      // console.log("handleMessageAdd-----ZZZZZZZZZZ------", messages);
      if (messages && messages.length !== 0) {
        chatStore.addNextMessages(messages);
        chatStore.setLoadingNextMessages(true);
        setTimeout(() => {
          chatStore.setLoadingNextMessages(false);
        }, 1000);
      }
    };

    chatStore.socket?.on("nextMessagesUser", handleNextMessageAdd);
    return () => {
      chatStore.socket?.off("nextMessagesUser", handleNextMessageAdd);
    };
  }, [chatStore.socket]);
  return {};
};

const useNextPrevMessageAdd = () => {
  useEffect(() => {
    const handleNextPrevMessageAdd = ({ messages, data }: IMessagesAdd) => {
      // console.log("handleMessageAdd-----ZZZZZZZZZZ------", messages);
      if (messages && messages.length !== 0 && data) {
        chatStore.setDataMessagesId({
          ...data,
          viewMessageId: data.lastMessageId,
          unreadMessagesCount: 0,
        });
        chatStore.addNextMessages(messages);
        chatStore.setLoadingPrevNextMessages(true);
        setTimeout(() => {
          chatStore.setLoadingPrevNextMessages(false);
        }, 1000);
      }
    };

    chatStore.socket?.on("nextPrevMessagesUser", handleNextPrevMessageAdd);
    return () => {
      chatStore.socket?.off("nextPrevMessagesUser", handleNextPrevMessageAdd);
    };
  }, [chatStore.socket]);
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

const useUpdateDataIdUser = () => {
  useEffect(() => {
    const handleUpdateDataIdUser = (data: IData) => {
      if (data) {
        // console.log("XXXXXXXXXX", data);
        chatStore.setDataMessagesId(data);
      }
    };

    chatStore.socket?.on("updateDataIdUser", handleUpdateDataIdUser);
    return () => {
      chatStore.socket?.off("updateDataIdUser", handleUpdateDataIdUser);
    };
  }, [chatStore.socket, chatStore.setDataMessagesId]);
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
  useMessagesStatus();
  useMessageWrite();
  useMessageRoom();
  useDeleteMessageByIdUser();
  useUpdateMessageByIdUser();
  usePrevMessageAdd();
  useNextMessageAdd();
  useNextPrevMessageAdd();
  useUpdateDataIdUser();
  return {};
};

export default useConnectHooks;
