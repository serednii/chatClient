import React from "react";
import io from "socket.io-client";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import EmojiPicker from "emoji-picker-react";

import icon from "../images/emoji.svg";
import styles from "../styles/Chat.module.css";
import Messages from "./Messages";
import Users from "./Users";
import { useRef } from "react";

// const socket = io.connect("https://chatserver-production-5470.up.railway.app/");
const socket = io.connect("http://localhost:5000/");

const Chat = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const [params, setParams] = useState({ room: "", user: "" });
  const [state, setState] = useState([]);
  const [message, setMessage] = useState("");
  const [isOpen, setOpen] = useState(false);
  const [users, setUsers] = useState(0);
  const [usersName, setUsersName] = useState(0);
  const [isWrite, setWrite] = useState(false);
  const [userWrite, setUserWrite] = useState([]);
  const numberTimeout = useRef(null);
  console.log("userWrite", userWrite);

  const debounce = (time) => {
    if (!isWrite) {
      //посилаємо при натисканні першої клавіші
      socket.emit("sendWrite", { isWrite: true, params });
    }
    setWrite(true);
    clearTimeout(numberTimeout.current);
    numberTimeout.current = setTimeout(() => {
      setWrite(false);
      //посилаємо gпісля натискання клавіш що закінчили ввід
      socket.emit("sendWrite", { isWrite: false, params });
    }, 10000);
  };

  const handleUserWrite = () => {
    debounce(10000);
  };

  //При вході користувача  приймаємо імя і кімнату
  useEffect(() => {
    const searchParams = Object.fromEntries(new URLSearchParams(search));
    setParams(searchParams);
    socket.emit("join", searchParams);
  }, [search]);

  useEffect(() => {
    socket.on("message", ({ data }) => {
      // console.log(data);
      setState((_state) => [..._state, data]);
    });
  }, []);

  useEffect(() => {
    socket.on("messageWrite", ({ data }) => {
      const { isWrite, user } = data;
      console.log(data);
      //маємо добавити в масив нового користувача який набирає текст
      if (isWrite) {
        //Находимо користувача в масиві
        const isUser = userWrite.includes(user.name);
        //Добавляємо нового який набирає текст
        console.log("isUser", isUser);
        if (!isUser) {
          setUserWrite([...userWrite, user.name]);
        }
      } else {
        //тут видаляємо користувача який закінчив набирати текст
        const isUser = userWrite.includes(user.name);
        //Видаляємо користувача який набирає текст
        if (!isUser) {
          setUserWrite(userWrite.filter((user) => user !== user.name));
        }
      }
      // console.log(data);
    });
  }, [userWrite]);

  useEffect(() => {
    socket.on("room", ({ data: { users } }) => {
      // console.log(users);
      setUsers(users.length);
      setUsersName(users);
    });
  }, []);

  const leftRoom = () => {
    socket.emit("leftRoom", { params });
    navigate("/");
  };

  const handleChange = ({ target: { value } }) => {
    handleUserWrite();
    setMessage(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message) return;
    socket.emit("sendMessage", { message, params });
    setMessage("");
  };

  const onEmojiClick = ({ emoji }) => setMessage(`${message} ${emoji}`);

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <h2 className={styles.title}>
          Room {params.room} Name {params.name}{" "}
          {isWrite && (
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
        </h2>
        <div className={styles.users}>{users} users in this room</div>
        <button className={styles.left} onClick={leftRoom}>
          Left the room
        </button>
      </header>

      <main className={styles.main}>
        <section className={styles.messages}>
          <Messages messages={state} name={params.name} />
        </section>
        <aside className={styles.users_list}>
          <Users
            usersName={usersName}
            userWrite={userWrite}
            name={params.name}
          />
        </aside>
      </main>
      <footer className={styles.footer}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.input}>
            <input
              type="text"
              name="message"
              placeholder="What do you want to say?"
              value={message}
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </div>
          <div className={styles.emoji}>
            <img src={icon} alt="" onClick={() => setOpen(!isOpen)} />

            {isOpen && (
              <div className={styles.emojies}>
                <EmojiPicker onEmojiClick={onEmojiClick} />
              </div>
            )}
          </div>

          <div className={styles.button}>
            <input
              type="submit"
              onSubmit={handleSubmit}
              value="Send a message"
            />
          </div>
        </form>
      </footer>
    </div>
  );
};

export default Chat;
