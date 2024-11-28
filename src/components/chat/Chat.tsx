import React, {
  useMemo,
  useEffect,
  useCallback,
  useState,
  useRef,
} from "react";

import { useLocation, useNavigate } from "react-router-dom";
import Messages from "../message/Messages";
import Users from "../users/Users";
import Footer from "../footer/Footer";
import Header from "../header/Header";
import useWebSocket from "../useWebsocket";
import {
  IMessageAdd,
  IMessageStart,
  IParams,
  IUsersName,
  IUserWrite,
} from "../interface";
import chatStore from "../../mobx/chatStore";
// import authStore from "../../AuthUser/mobx/AuthStore";
import styles from "./Chat.module.scss";
import { observer } from "mobx-react-lite";

const Chat: React.FC = () => {
  // const [params, setParams] = useState<IParams>({ room: "", name: "" });
  // const [userStatus, setUserStatus] = useState<IUsersName[]>([]);
  // const [isWrite, setWrite] = useState<boolean>(false);

  console.log("RENDER CHAT");
  const { search } = useLocation();
  const navigate = useNavigate();
  // const {
  //   socket,
  //   state,
  //   // params,
  //   isDeleteMessage,
  //   message,
  //   userWrite,
  //   usersName,
  // } = chatStore;
  // const {
  //   setMessage,
  //   setUsersName,
  //   setUsers,
  //   addMessage,
  //   setState,
  //   // setParams,
  //   setUserWrite,
  //   addUserWrite,
  //   // setUserStatus,
  // } = chatStore;

  // console.log("state", chatStore.state);
  const hasJoined = useRef(false);

  useWebSocket();

  const deleteMessageById = (id: number): void => {
    if (chatStore.socket) {
      chatStore.socket.emit("deleteMessageById", {
        id,
        room: chatStore.params.room,
      });
    }
  };

  const updateMessageById = (id: number, message: string): void => {
    if (chatStore.socket) {
      chatStore.socket.emit("updateMessageById", {
        id,
        room: chatStore.params.room,
        message,
      });
    }
  };

  const clearSetWrite = useCallback((): void => {
    chatStore.setWrite(false);
    chatStore.socket?.emit("sendWrite", {
      isWrite: false,
      params: chatStore.params,
    });
  }, [chatStore.socket, chatStore.params]);

  const handleSubmitChat = useCallback(
    (message: string): void => {
      if (!message) return;
      chatStore.setWrite(false);
      chatStore.socket?.emit("sendWrite", {
        isWrite: false,
        params: chatStore.params,
      });
      chatStore.socket?.emit("sendMessage", {
        message,
        params: chatStore.params,
      });
    },
    [chatStore.socket, chatStore.params]
  );

  const handleChangeChat = useCallback(() => {
    if (!chatStore.isWrite) {
      console.log('socket?.emit("sendWrite", { isWrite: true, params });');
      chatStore.socket?.emit("sendWrite", {
        isWrite: true,
        params: chatStore.params,
      });
      chatStore.setWrite(true);
    }
  }, [chatStore.socket, chatStore.params, chatStore.isWrite]);

  useEffect(() => {
    if (chatStore.isDeleteMessage) {
      handleChangeChat();
    } else {
      clearSetWrite();
    }
  }, [chatStore.isDeleteMessage]);
  console.log("chatStore:", chatStore);
  console.log("setParams function:", chatStore.setParams);
  // //При вході користувача  приймаємо імя і кімнату
  useEffect(() => {
    if (!chatStore.socket) return;

    if (!hasJoined.current) {
      console.log("JOIN----------------------------", search);
      const searchParamsObj = Object.fromEntries(new URLSearchParams(search));
      const searchParams: IParams = {
        name: searchParamsObj.name || "",
        room: searchParamsObj.room || "",
      };
      console.log(searchParams);
      if (searchParams.name && searchParams.room) {
        console.log("chatStore:", chatStore);
        console.log("setParams function:", chatStore.setParams);
        chatStore.setParams(searchParams);
        chatStore.socket.emit("join", searchParams);
        hasJoined.current = true; // Позначаємо, що користувач уже приєднався
      } else {
        console.error("Missing required search parameters: name and/or room.");
      }
    }
  }, [chatStore.socket, search]);

  useEffect(() => {
    // console.log(socket);
    const handleMessageStart = ({ messages }: IMessageStart) => {
      console.log("messageStart----------------------------", messages);
      if (messages) {
        chatStore.setState(messages);
      }
    };
    chatStore.socket?.on("messageStart", handleMessageStart);
    return () => {
      chatStore.socket?.off("messageStart", handleMessageStart);
    };
  }, [chatStore.socket, chatStore.state]);

  useEffect(() => {
    const handleMessageAdd = ({ message }: IMessageAdd) => {
      console.log("data-=-=-=-=-/////////", message);
      if (message) {
        chatStore.addMessage(message);
      }
    };
    chatStore.socket?.on("messageAdd", handleMessageAdd);
    return () => {
      chatStore.socket?.off("messageAdd", handleMessageAdd);
    };
  }, [chatStore.socket, chatStore.state]);

  useEffect(() => {
    const handleStatusMessage = ({ data }: any) => {
      chatStore.setUserStatus(data?.roomUsers);
    };
    chatStore.socket?.on("messageStatus", handleStatusMessage);
    return () => {
      chatStore.socket?.off("messageStatus", handleStatusMessage);
    };
  }, [chatStore.socket]);

  // console.log(
  //   "Number of listeners for message:",
  //   socket?.listeners("message")?.length
  // );

  // console.log(
  //   "Number of listeners for messageStatus:",
  //   socket?.listeners("messageStatus")?.length
  // );

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
        console.log("Добавляємо нового який набирає текст");
        if (!isUser) {
          console.log(chatStore.userWrite);
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

  useEffect(() => {
    const handleDeleteMessageById = ({ id }: any) => {
      deleteMessageById(id);
    };
    chatStore.socket?.on("deleteMessageById", handleDeleteMessageById);
    return () => {
      chatStore.socket?.off("deleteMessageById", handleDeleteMessageById);
    };
  }, [chatStore.socket, chatStore.state]);

  useEffect(() => {
    const handleUpdateMessageById = ({ id, message }: any) => {
      if (chatStore.state) {
        updateMessageById(id, message);
      }
    };
    chatStore.socket?.on("updateMessageById", handleUpdateMessageById);
    return () => {
      chatStore.socket?.off("updateMessageById", handleUpdateMessageById);
    };
  }, [chatStore.socket, chatStore.state]);

  const leftRoom = (): void => {
    chatStore.socket?.emit("leftRoom", { params: chatStore.params });
    navigate("/main");
    chatStore.socket?.disconnect();
  };

  const onEmojiClick = ({ emoji }: any) =>
    chatStore.setMessage(`${chatStore.message} ${emoji}`);

  return (
    <div className={styles.wrap}>
      <Header leftRoom={leftRoom} />

      <main className={styles.main}>
        <section className={styles.messages}>
          {chatStore.state.length > 0 && (
            <Messages
              deleteMessageById={deleteMessageById}
              updateMessageById={updateMessageById}
              name={chatStore.params.name}
            />
          )}
        </section>
        <aside className={styles.users_list}>
          <Users
            usersName={chatStore.usersName}
            userWrite={chatStore.userWrite}
            userStatus={chatStore.userStatus}
          />
        </aside>
      </main>

      <Footer
        handleSubmitChat={handleSubmitChat}
        onEmojiClick={onEmojiClick}
        clearSetWrite={clearSetWrite}
        handleChangeChat={handleChangeChat}
      />
    </div>
  );
};

export default observer(Chat);
