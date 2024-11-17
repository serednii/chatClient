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
import { IParams, IState, IUsersName, IUserWrite } from "../interface";
import styles from "./Chat.module.scss";
import {
  THandleChange,
  TDebouncedFunction,
  TGetTimer,
  TDebounce,
} from "../type";
// const socket: Socket = io(URL_SERVER, { path: "/socket" });

const Chat: React.FC = () => {
  console.log("RENDER CHAT");
  const { search } = useLocation();
  const navigate = useNavigate();
  const [params, setParams] = useState<IParams>({ room: "", name: "" });
  const [state, setState] = useState<IState[]>([]);
  const [message, setMessage] = useState<string>("");
  const [users, setUsers] = useState<number>(0);
  const [usersName, setUsersName] = useState<IUsersName[]>([]);
  const [isWrite, setWrite] = useState<boolean | null>(null);
  const [userWrite, setUserWrite] = useState<IUserWrite[]>([]);
  const [userStatus, setUserStatus] = useState<IUsersName[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const debouncedFunctionRef = useRef<TDebouncedFunction | null>(null);
  const getTimerRef = useRef<TGetTimer | null>(null);

  // const numberTimeout = useRef<any>(null);
  const [debouncedFunction, getTimer]: TDebounce = debounce(
    (params: IParams) => {
      // console.log(socket);
      console.log("params ", params);
      clearSetWrite(params); // Ваш код
    },
    6000
  );

  useEffect(() => {
    const newSocket: Socket = io(URL_SERVER, { path: "/socket" });
    setSocket(newSocket);
    return () => {
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
  // console.log("userStatus", userStatus);
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
      // console.log("message----------------------------", data);
      setState((_state: IState[]) => [..._state, data]);
      // setUserStatus([data]);
    });
  }, [socket]);

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
          <Messages messages={state} name={params.name} />
        </section>
        <aside className={styles.users_list}>
          <Users
            usersName={usersName}
            userWrite={userWrite}
            name={params.name}
            userStatus={userStatus}
            leftRoom={leftRoom}
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
