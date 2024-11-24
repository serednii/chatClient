import React, {
  useMemo,
  useEffect,
  useCallback,
  useState,
  useRef,
} from "react";

import io, { Socket } from "socket.io-client";
import { useLocation, useNavigate } from "react-router-dom";
import Messages from "../message/Messages";
import Users from "../users/Users";
import Footer from "../footer/Footer";
import Header from "../header/Header";
import useWebSocket from "../useWebsocket";
import {
  IMessage,
  IMessageAdd,
  IMessageStart,
  IParams,
  IState,
  IUsersName,
  IUserWrite,
} from "../interface";
import chatStore from "../../mobx/chatStore";
import authStore from "../../AuthUser/mobx/AuthStore";

import styles from "./Chat.module.scss";

const Chat: React.FC = () => {
  console.log("RENDER CHAT");
  const { search } = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>("");
  const [users, setUsers] = useState<number>(0);
  const [usersName, setUsersName] = useState<IUsersName[]>([]);
  const [userWrite, setUserWrite] = useState<IUserWrite[]>([]);
  const [userStatus, setUserStatus] = useState<IUsersName[]>([]);

  console.log(authStore.isAuth);
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

      if (searchParams.name && searchParams.room) {
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
    const handleMessageStart = ({ data }: IMessageStart) => {
      console.log("messageStart----------------------------", data);
      if (data) {
        chatStore.setState(data.messages);
      }
    };
    chatStore.socket?.on("messageStart", handleMessageStart);
    return () => {
      chatStore.socket?.off("messageStart", handleMessageStart);
    };
  }, [chatStore.socket, chatStore.state]);

  useEffect(() => {
    const handleMessageAdd = ({ data }: IMessageAdd) => {
      if (data && data.message) {
        chatStore.addMessage(data.message);
      }
    };

    chatStore.socket?.on("messageAdd", handleMessageAdd);
    return () => {
      chatStore.socket?.off("messageAdd", handleMessageAdd);
    };
  }, [chatStore.socket, chatStore.state]);

  useEffect(() => {
    const handleStatusMessage = ({ data }: any) => {
      setUserStatus(data?.roomUsers);
    };
    chatStore.socket?.on("messageStatus", handleStatusMessage);
    return () => {
      chatStore.socket?.off("messageStatus", handleStatusMessage);
    };
  }, [chatStore.socket]);

  console.log(
    "Number of listeners for message:",
    chatStore.socket?.listeners("message")?.length
  );

  console.log(
    "Number of listeners for messageStatus:",
    chatStore.socket?.listeners("messageStatus")?.length
  );

  console.log(
    "Number of listeners for messageWrite:",
    chatStore.socket?.listeners("messageWrite")?.length
  );

  useEffect(() => {
    const handleStatusMessageWrite = ({ data }: any) => {
      const { isWrite, user } = data;
      console.log(user.name);
      if (user.name === chatStore.params.name) {
        return;
      }
      const isUser: IUserWrite | undefined = userWrite.find(
        (_user: IUserWrite) => _user.name === user.name
      );

      //маємо добавити в масив нового користувача який набирає текст
      if (isWrite) {
        //Находимо користувача в масиві
        //Добавляємо нового який набирає текст
        if (!isUser) {
          // console.log(userWrite);
          // setUserWrite([...userWrite, { name: user.name }]);
          setUserWrite((prevUserWrite: IUserWrite[]) => [
            ...prevUserWrite,
            { name: user.name },
          ]);
        }
      } else {
        //тут видаляємо користувача який закінчив набирати текст
        //Видаляємо користувача який набирає текст
        if (!isUser) {
          setUserWrite(
            userWrite.filter((_user: IUserWrite) => _user.name !== user.name)
          );
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
      setUsers(users.length);
      setUsersName(users);
    };
    chatStore.socket?.on("room", handleRoom);
    return () => {
      chatStore.socket?.off("room", handleRoom);
    };
  }, [chatStore.socket]);

  useEffect(() => {
    const handleDeleteMessageById = ({ id }: any) => {
      chatStore.deleteMessageById(id);
    };
    chatStore.socket?.on("deleteMessageById", handleDeleteMessageById);
    return () => {
      chatStore.socket?.off("deleteMessageById", handleDeleteMessageById);
    };
  }, [chatStore.socket, chatStore.state]);

  useEffect(() => {
    const handleUpdateMessageById = ({ id, message }: any) => {
      if (chatStore.state) {
        chatStore.updateMessageById(id, message);
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

  const onEmojiClick = ({ emoji }: any) => setMessage(`${message} ${emoji}`);

  return (
    <div className={styles.wrap}>
      <Header leftRoom={leftRoom} users={users} />

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
            usersName={usersName}
            userWrite={userWrite}
            userStatus={userStatus}
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

export default Chat;
