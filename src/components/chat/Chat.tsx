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
  const [params, setParams] = useState<IParams>({ room: "", name: "" });
  const [userStatus, setUserStatus] = useState<IUsersName[]>([]);
  const [isWrite, setWrite] = useState<boolean>(false);

  console.log("RENDER CHAT");
  const { search } = useLocation();
  const navigate = useNavigate();
  const {
    socket,
    state,
    // params,
    isDeleteMessage,
    message,
    userWrite,
    usersName,
  } = chatStore;
  const {
    setMessage,
    setUsersName,
    setUsers,
    addMessage,
    setState,
    // setParams,
    setUserWrite,
    addUserWrite,
    // setUserStatus,
  } = chatStore;

  // console.log("state", chatStore.state);
  const hasJoined = useRef(false);

  useWebSocket();

  const deleteMessageById = (id: number): void => {
    if (socket) {
      socket.emit("deleteMessageById", {
        id,
        room: chatStore.params.room,
      });
    }
  };

  const updateMessageById = (id: number, message: string): void => {
    if (socket) {
      socket.emit("updateMessageById", {
        id,
        room: chatStore.params.room,
        message,
      });
    }
  };

  const clearSetWrite = useCallback((): void => {
    setWrite(false);
    socket?.emit("sendWrite", {
      isWrite: false,
      params: chatStore.params,
    });
  }, [chatStore.socket, chatStore.params]);

  const handleSubmitChat = useCallback(
    (message: string): void => {
      if (!message) return;
      setWrite(false);
      socket?.emit("sendWrite", {
        isWrite: false,
        params: chatStore.params,
      });
      socket?.emit("sendMessage", {
        message,
        params: chatStore.params,
      });
    },
    [chatStore.socket, chatStore.params]
  );

  const handleChangeChat = useCallback(() => {
    if (!chatStore.isWrite) {
      console.log('socket?.emit("sendWrite", { isWrite: true, params });');
      socket?.emit("sendWrite", {
        isWrite: true,
        params: chatStore.params,
      });
      setWrite(true);
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
        setParams(searchParams);
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
        setState(messages);
      }
    };
    socket?.on("messageStart", handleMessageStart);
    return () => {
      socket?.off("messageStart", handleMessageStart);
    };
  }, [socket, state]);

  // useEffect(() => {
  //   const handleMessageAdd = ({ message }: IMessageAdd) => {
  //     console.log("data-=-=-=-=-/////////", message);
  //     if (message) {
  //       addMessage(message);
  //     }
  //   };
  //   socket?.on("messageAdd", handleMessageAdd);
  //   return () => {
  //     socket?.off("messageAdd", handleMessageAdd);
  //   };
  // }, [socket, state]);

  // useEffect(() => {
  //   const handleStatusMessage = ({ data }: any) => {
  //     setUserStatus(data?.roomUsers);
  //   };
  //   socket?.on("messageStatus", handleStatusMessage);
  //   return () => {
  //     socket?.off("messageStatus", handleStatusMessage);
  //   };
  // }, [socket]);

  // console.log(
  //   "Number of listeners for message:",
  //   socket?.listeners("message")?.length
  // );

  // console.log(
  //   "Number of listeners for messageStatus:",
  //   socket?.listeners("messageStatus")?.length
  // );

  // console.log(
  //   "Number of listeners for messageWrite:",
  //   socket?.listeners("messageWrite")?.length
  // );

  // useEffect(() => {
  //   const handleStatusMessageWrite = ({ data }: any) => {
  //     const { isWrite, user } = data;
  //     console.log(user.name);
  //     if (user.name === params.name) {
  //       return;
  //     }
  //     const isUser: IUserWrite | undefined = userWrite.find(
  //       (_user: IUserWrite) => _user.name === user.name
  //     );

  //     //маємо добавити в масив нового користувача який набирає текст
  //     if (isWrite) {
  //       //Находимо користувача в масиві
  //       //Добавляємо нового який набирає текст
  //       if (!isUser) {
  //         // console.log(userWrite);
  //         addUserWrite({ name: user.name });
  //       }
  //     } else {
  //       //тут видаляємо користувача який закінчив набирати текст
  //       //Видаляємо користувача який набирає текст
  //       if (!isUser) {
  //         setUserWrite(
  //           userWrite.filter((_user: IUserWrite) => _user.name !== user.name)
  //         );
  //       }
  //     }
  //   };
  //   socket?.on("messageWrite", handleStatusMessageWrite);
  //   return () => {
  //     socket?.off("messageWrite", handleStatusMessageWrite);
  //   };
  // }, [socket]);

  // useEffect(() => {
  //   const handleRoom = ({ data: { users } }: any) => {
  //     setUsers(users.length);
  //     setUsersName(users);
  //   };
  //   socket?.on("room", handleRoom);
  //   return () => {
  //     socket?.off("room", handleRoom);
  //   };
  // }, [socket]);

  // useEffect(() => {
  //   const handleDeleteMessageById = ({ id }: any) => {
  //     deleteMessageById(id);
  //   };
  //   socket?.on("deleteMessageById", handleDeleteMessageById);
  //   return () => {
  //     socket?.off("deleteMessageById", handleDeleteMessageById);
  //   };
  // }, [socket, state]);

  // useEffect(() => {
  //   const handleUpdateMessageById = ({ id, message }: any) => {
  //     if (state) {
  //       updateMessageById(id, message);
  //     }
  //   };
  //   socket?.on("updateMessageById", handleUpdateMessageById);
  //   return () => {
  //     socket?.off("updateMessageById", handleUpdateMessageById);
  //   };
  // }, [socket, state]);

  const leftRoom = (): void => {
    socket?.emit("leftRoom", { params: params });
    navigate("/main");
    socket?.disconnect();
  };

  const onEmojiClick = ({ emoji }: any) => setMessage(`${message} ${emoji}`);

  return (
    <div className={styles.wrap}>
      <Header leftRoom={leftRoom} />

      <main className={styles.main}>
        <section className={styles.messages}>
          {state.length > 0 && (
            <Messages
              deleteMessageById={deleteMessageById}
              updateMessageById={updateMessageById}
              name={params.name}
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

export default observer(Chat);
