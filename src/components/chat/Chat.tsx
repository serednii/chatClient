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
import controllerChat from "./controllerChat";
import useWebSocket from "../useWebsocket";
import {
  IMessage,
  IParams,
  IState,
  IUsersName,
  IUserWrite,
} from "../interface";
import chatStore from "../../mobx/chatStore";
import authStore from "../../AuthUser/mobx/AuthStore";

import styles from "./Chat.module.scss";
// let hasJoined = false; // Флаг для перевірки
const Chat: React.FC = () => {
  console.log("RENDER CHAT");
  const { search } = useLocation();
  const navigate = useNavigate();
  const [state, setState] = useState<IState>();
  const [message, setMessage] = useState<string>("");
  const [users, setUsers] = useState<number>(0);
  const [usersName, setUsersName] = useState<IUsersName[]>([]);
  const [userWrite, setUserWrite] = useState<IUserWrite[]>([]);
  const [userStatus, setUserStatus] = useState<IUsersName[]>([]);
  console.log(authStore.isAuth);
  // console.log("state **** *** ", state);
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
    const handleMessage = ({ data }: any) => {
      console.log("message----------------------------", data);
      if (data) {
        //Якщо є особисте повідомлення messageAdmin то добавляємо його в потік повідомлень
        if (data?.messageAdmin) {
          const adminMessage = {
            author: "Admin",
            date: new Date(),
            id: data?.messageAdmin?.id,
            message: data?.messageAdmin?.message,
            status: 0,
          };
          data?.message?.messages?.push(adminMessage);
          delete data?.messageAdmin;
        }
        console.log("lastMessage", data);

        //Якщо state пустий , зайшли перший раз
        if (!state) {
          setState(data);
        } else {
          //вибрати останні повідомлення яких немає в нашому списку
          const lastMessages: IMessage[] = data?.message?.messages?.filter(
            (message: IMessage) =>
              !state?.message?.messages?.some(
                (m: IMessage) => m.id === message.id
              )
          );

          state?.message?.messages.push(...lastMessages);
          setState(structuredClone(state));

          // const updatedMessages = [...state.message.messages, ...lastMessages];
          // const updatedState = {
          //   ...state,
          //   message: { ...state.message, messages: updatedMessages },
          // };
          // setState(updatedState);
        }

        // setState((prevState) => ({
        //   ...prevState,
        //   ...state,
        // }));
      }
    };
    chatStore.socket?.on("message", handleMessage);
    return () => {
      chatStore.socket?.off("message", handleMessage);
    };
  }, [chatStore.socket, state]);

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
      if (state) {
        controllerChat.deleteMessageStateById(id, state, setState);
      }
    };
    chatStore.socket?.on("deleteMessageById", handleDeleteMessageById);
    return () => {
      chatStore.socket?.off("deleteMessageById", handleDeleteMessageById);
    };
  }, [chatStore.socket, state]);

  useEffect(() => {
    const handleUpdateMessageById = ({ id, message }: any) => {
      if (state) {
        controllerChat.updateMessageStateById(id, message, state, setState);
      }
    };
    chatStore.socket?.on("updateMessageById", handleUpdateMessageById);
    return () => {
      chatStore.socket?.off("updateMessageById", handleUpdateMessageById);
    };
  }, [chatStore.socket, state]);

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
          {state !== undefined && (
            <Messages
              deleteMessageById={deleteMessageById}
              updateMessageById={updateMessageById}
              state={state}
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
