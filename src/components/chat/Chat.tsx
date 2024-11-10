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
import { URL_SERVER } from "../const";
import Users from "../users/Users";
import { debounce } from "../Util";
import Footer from "../footer/Footer";
import Header from "../header/Header";
import { IParams, IState } from "../interface";
import styles from "./Chat.module.scss";

type THandleChange = (e: React.ChangeEvent<HTMLInputElement>) => void;
const socket: Socket = io(URL_SERVER, { path: "/socket" });

interface IUsersName {
  name: string;
  room: string;
  status: string;
  time: number;
  userSocketId: string;
}

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
  const [userWrite, setUserWrite] = useState<any>([]);
  const [userStatus, setUserStatus] = useState<any>([]);
  const numberTimeout = useRef<any>(null);
  const debouncedFunctionRef = useRef<any>(null);
  const getTimerRef = useRef<any>(null);

  console.log("userStatus", userStatus);
  console.log("userStatus ", userStatus);
  console.log("userWrite ", userWrite);

  // const { debouncedFunction, getTimer } = useCallback(
  //   debounce((params: any) => {
  //     clearSetWrite(params);
  //   }, 6000),
  //   []
  // );

  const [debouncedFunction, getTimer] = debounce((params: any) => {
    clearSetWrite(params); // Ваш код
  }, 6000);

  if (!debouncedFunctionRef.current) {
    debouncedFunctionRef.current = debouncedFunction;
  }

  if (!getTimerRef.current) {
    getTimerRef.current = getTimer;
  }

  const clearSetWrite = useCallback((params: IParams): void => {
    setWrite(() => false);
    socket.emit("sendWrite", { isWrite: false, params });
  }, []);

  const handleChange: THandleChange = ({ target: { value } }) => {
    if (!isWrite) {
      socket.emit("sendWrite", { isWrite: true, params });
      setWrite(true);
    }
    debouncedFunctionRef.current(params);
    setMessage(() => value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!message) return;
    clearTimeout(getTimerRef.current());
    setWrite(() => false);
    socket.emit("sendWrite", { isWrite: false, params });
    socket.emit("sendMessage", { message, params });
    setMessage("");
  };

  //При вході користувача  приймаємо імя і кімнату
  useEffect(() => {
    const searchParams: any = Object.fromEntries(new URLSearchParams(search));
    setParams(searchParams);
    socket.emit("join", searchParams);
  }, [search]);

  useEffect(() => {
    socket.on("message", ({ data }) => {
      console.log("message----------------------------", data);
      setState((_state: any) => [..._state, data]);
    });
  }, []);

  useEffect(() => {
    socket.on("messageStatus", ({ data }) => {
      console.log("messageStatus-------3333333333----------", data);
      setUserStatus(data?.roomUsers);
    });
  }, []);

  useEffect(() => {
    socket.on("messageWrite", ({ data }) => {
      const { isWrite, user } = data;
      console.log(user.name);
      if (user.name === params.name) {
        return;
      }
      const isUser: any = userWrite.find(
        (_user: any) => _user.name === user.name
      );
      //маємо добавити в масив нового користувача який набирає текст
      if (isWrite) {
        //Находимо користувача в масиві
        //Добавляємо нового який набирає текст
        if (!isUser) {
          console.log(userWrite);
          // setUserWrite([...userWrite, { name: user.name }]);
          setUserWrite((prevUserWrite: any) => [
            ...prevUserWrite,
            { name: user.name },
          ]);
        }
      } else {
        //тут видаляємо користувача який закінчив набирати текст

        //Видаляємо користувача який набирає текст
        if (!isUser) {
          setUserWrite(
            userWrite.filter((_user: any) => _user.name !== user.name)
          );
        }
      }
    });
  }, []);

  useEffect(() => {
    socket.on("room", ({ data: { users } }) => {
      console.log(socket);
      setUsers(users.length);
      setUsersName(users);
    });
  }, []);

  const leftRoom = (): void => {
    socket.emit("leftRoom", { params });
    navigate("/");
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
