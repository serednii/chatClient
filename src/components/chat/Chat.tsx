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
import { URL_SERVER } from "../../config";
import Users from "../users/Users";
import { debounce } from "../Util";
import Footer from "../footer/Footer";
import Header from "../header/Header";
import {
  IMessage,
  IParams,
  IState,
  IUsersName,
  IUserWrite,
} from "../interface";
import styles from "./Chat.module.scss";
import {
  THandleChange,
  TDebouncedFunction,
  TGetTimer,
  TDebounce,
} from "../type";
// const socket: Socket = io(URL_SERVER, { path: "/socket" });
let reconnectInterval = 1000;

const Chat: React.FC = () => {
  console.log("RENDER CHAT");
  const { search } = useLocation();
  const navigate = useNavigate();
  const [params, setParams] = useState<IParams>({ room: "", name: "" });
  const [state, setState] = useState<IState>();
  const [message, setMessage] = useState<string>("");
  const [users, setUsers] = useState<number>(0);
  const [usersName, setUsersName] = useState<IUsersName[]>([]);
  const [isWrite, setWrite] = useState<boolean | null>(null);
  const [userWrite, setUserWrite] = useState<IUserWrite[]>([]);
  const [userStatus, setUserStatus] = useState<IUsersName[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const debouncedFunctionRef = useRef<TDebouncedFunction | null>(null);
  const getTimerRef = useRef<TGetTimer | null>(null);
  const paramsRef = useRef(params);
  // const [reconnect, setReconnect] = useState<boolean>(false);

  // console.log("state **** *** ", state);

  const isTrue = useRef(state);
  isTrue.current = state;

  const deleteMessageStateById = (id: number, state: IState): void => {
    isTrue.current = state;
    const newMessages = state?.message?.messages?.filter(
      (message) => message.id !== id
    );
    if (state && newMessages) {
      // setState(structuredClone(state));
      setState((prevState) => {
        if (!prevState) {
          return prevState; // або поверніть початковий стан, якщо це необхідно
        }
        return {
          ...prevState,
          message: {
            ...prevState.message,
            messages: newMessages,
          },
        };
      });
    }
  };

  const updateMessageStateById = (
    id: number,
    message: string,
    state: IState
  ): void => {
    isTrue.current = state;
    const newMessages = state?.message?.messages?.find(
      (message) => message.id === id
    );

    if (newMessages) {
      newMessages.message = message;
    }

    if (state && newMessages) {
      // setState(structuredClone(state));
      setState((prevState) => {
        if (!prevState) {
          return prevState; // або поверніть початковий стан, якщо це необхідно
        }
        return {
          ...prevState,
          message: {
            ...prevState.message,
          },
        };
      });
    }
  };

  const deleteMessageById = (id: number): void => {
    console.log('0000000000000000000',id)
    if (socket) {
      socket.emit("deleteMessageById", { id, room: params.room });
    }
  };

  const updateMessageById = (id: number, message: string): void => {
    if (socket) {
      socket.emit("updateMessageById", { id, room: params.room, message });
    }
  };

  // const numberTimeout = useRef<any>(null);
  const [debouncedFunction, getTimer]: TDebounce = debounce(
    (params: IParams) => {
      // console.log(socket);
      // console.log("params ", params);
      clearSetWrite(params); // Ваш код
    },
    6000
  );

  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  const getParams = () => paramsRef.current;

  useEffect(() => {
    const newSocket: Socket = io(URL_SERVER, {
      path: "/socket",
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: reconnectInterval,
      reconnectionDelayMax: 30000,
    });

    setSocket(newSocket);

    const handleReconnect = () => {
      console.log("WebSocket connection reestablished");
      newSocket.emit("join", getParams());
      reconnectInterval = 1000; // Скидаємо інтервал перепідключення
    };

    const handleDisconnect = () => {
      console.log("WebSocket connection lost, attempting to reconnect...");
      reconnectInterval = Math.min(reconnectInterval * 2, 30000); // Експоненціальне збільшення до 30 секунд
    };

    const handleError = (error: any) => {
      console.error("WebSocket error observed:", error);
    };

    newSocket.on("connect", handleReconnect);
    newSocket.on("disconnect", handleDisconnect);
    newSocket.on("error", handleError);

    return () => {
      newSocket.off("connect", handleReconnect);
      newSocket.off("disconnect", handleDisconnect);
      newSocket.off("error", handleError);
      newSocket.disconnect();
      // Очищаємо з'єднання при розмонтуванні компонента
    };
  }, []);

  //При вході користувача  приймаємо імя і кімнату
  useEffect(() => {
    if (socket) {
      const searchParamsObj = Object.fromEntries(new URLSearchParams(search));
      const searchParams: IParams = {
        name: searchParamsObj.name || "",
        room: searchParamsObj.room || "",
      };
      if (searchParams.name && searchParams.room) {
        setParams(searchParams);
        socket.emit("join", searchParams);
      } else {
        console.error("Missing required search parameters: name and/or room.");
      }
    }
  }, [socket, search]);

  // console.log("Start Socket", socket);
  // Порожній масив залежностей означає, що useEffect виконується лише один раз
  // console.log("userStatus ", userStatus);
  // console.log("userWrite ", userWrite);
  // console.log("debouncedFunctionRef.current ", debouncedFunctionRef.current);

  useEffect(() => {
    debouncedFunctionRef.current = debouncedFunction;
  }, [socket]);

  if (!getTimerRef.current) {
    getTimerRef.current = getTimer;
  }

  const clearSetWrite = useCallback(
    (params: IParams): void => {
      setWrite(() => false);
      // console.log(socket);
      socket?.emit("sendWrite", { isWrite: false, params });
    },
    [socket]
  );

  const handleChange: THandleChange = ({ target: { value } }) => {
    if (!isWrite) {
      socket?.emit("sendWrite", { isWrite: true, params });
      setWrite(true);
    }
    if (debouncedFunctionRef.current) {
      debouncedFunctionRef.current(params);
    }
    setMessage(() => value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!message) return;
    if (getTimerRef.current) {
      clearTimeout(getTimerRef.current());
    }
    setWrite(() => false);
    socket?.emit("sendWrite", { isWrite: false, params });
    socket?.emit("sendMessage", { message, params });
    setMessage("");
  };

  useEffect(() => {
    // console.log(socket);
    socket?.on("message", ({ data }) => {
      console.log("message----------------------------", data);
      if (data) {
        // console.log("lastMessage", state?.message?.messages);
        // console.log("lastMessage", data);

        //Якщо є особисте повідомлення messageAdmin то добавляємо його в потік повідомлень

        // console.log("data?.messageAdmin?.id,", data?.messageAdmin?.id);
        // console.log("data?.messageAdmin?.message", data?.messageAdmin?.message);
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
          // console.log("lastMessage", lastMessages);
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
    });
  }, [socket, state]);

  useEffect(() => {
    socket?.on("messageStatus", ({ data }) => {
      // console.log("messageStatus-------3333333333----------", data);
      setUserStatus(data?.roomUsers);
    });
  }, [socket]);

  useEffect(() => {
    socket?.on("messageWrite", ({ data }) => {
      const { isWrite, user } = data;
      // console.log(user.name);
      if (user.name === params.name) {
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
    });
  }, [socket]);

  useEffect(() => {
    socket?.on("room", ({ data: { users } }) => {
      // console.log("room-----", users);
      setUsers(users.length);
      setUsersName(users);
    });
  }, [socket]);

  useEffect(() => {
    socket?.on("deleteMessageById", ({ id }) => {
      console.log("deleteMessageById", id);
      if (state) {
        deleteMessageStateById(id, state);
      }
    });
  }, [socket, state]);

  useEffect(() => {
    socket?.on("updateMessageById", ({ id, message }) => {
      console.log("updateMessageById", id, message);
      if (state) {
        updateMessageStateById(id, message, state);
      }
    });
  }, [socket, state]);

  // useEffect(() => {
  //   socket?.on("privateMessage", ({ data }) => {
  //     console.log("test test test test test ", data);

  //   });
  // }, [socket]);

  const leftRoom = (): void => {
    socket?.emit("leftRoom", { params });
    navigate("/");
    socket?.disconnect();
  };

  const onEmojiClick = ({ emoji }: any) => setMessage(`${message} ${emoji}`);

  return (
    <div className={styles.wrap}>
      <Header
        leftRoom={leftRoom}
        params={params}
        users={users}
        isWrite={isWrite}
      />

      <main className={styles.main}>
        <section className={styles.messages}>
          {state !== undefined && (
            <Messages
              deleteMessageById={deleteMessageById}
              updateMessageById={updateMessageById}
              state={state}
              name={params.name}
            />
          )}
        </section>
        <aside className={styles.users_list}>
          <Users
            usersName={usersName}
            userWrite={userWrite}
            name={params.name}
            userStatus={userStatus}
          />
        </aside>
      </main>

      <Footer
        handleSubmit={handleSubmit}
        onEmojiClick={onEmojiClick}
        handleChange={handleChange}
        message={message}
      />
    </div>
  );
};

export default Chat;
