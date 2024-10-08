import React from "react";
import io from "socket.io-client";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import styles from "./Chat.module.css";
import Messages from "../Messages";

import { useRef } from "react";
import { useCallback } from "react";
import Users from "../users/Users";
import { debounce } from "../Util";
import Footer from "../footer/Footer";
import Header from "../header/Header";

// const socket = io.connect("https://chatserver-production-5470.up.railway.app/");
const socket = io.connect("http://localhost:5000/");

const Chat = () => {
  console.log("RENDER CHAT");
  const { search } = useLocation();
  const navigate = useNavigate();
  const [params, setParams] = useState({ room: "", user: "" });
  const [state, setState] = useState([]);
  const [message, setMessage] = useState("");

  const [users, setUsers] = useState(0);
  const [usersName, setUsersName] = useState(0);
  const [isWrite, setWrite] = useState(false);
  const [userWrite, setUserWrite] = useState([]);
  const numberTimeout = useRef(null);
  console.log("userWrite", userWrite);
  console.log("params ", params);

  const [debouncedHandleUserWrite, getTimer] = useCallback(
    debounce((params) => {
      clearSetWrite(params); // Очистка статусу "набирає текст"
    }, 15000),
    [] // додаємо clearSetWrite як залежність
  );

  const clearSetWrite = useCallback((params) => {
    setWrite(false);
    console.log("clearSetWrite", params);
    socket.emit("sendWrite", { isWrite: false, params });
  }, []);

  const handleUserWrite = (params) => {
    if (!isWrite) {
      // Посилаємо подію при першому натисканні на клавіші
      socket.emit("sendWrite", { isWrite: true, params });
      setWrite(true);
    }
    debouncedHandleUserWrite(params); // Використовуємо дебаунс-функцію
  };

  // Ваша інша логіка, наприклад, для відправки повідомлення:
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message) return;

    clearTimeout(getTimer());
    console.log("/////////////", getTimer());

    setWrite(false);

    socket.emit("sendWrite", { isWrite: false, params });
    socket.emit("sendMessage", { message, params });
    setMessage("");
  };

  const handleChange = useCallback(({ target: { value } }) => {
    handleUserWrite(params);
    setMessage(value);
  });

  //При вході користувача  приймаємо імя і кімнату
  useEffect(() => {
    const searchParams = Object.fromEntries(new URLSearchParams(search));
    setParams(searchParams);
    socket.emit("join", searchParams);
  }, [search]);

  useEffect(() => {
    socket.on("message", ({ data }) => {
      console.log("message----------------------------", data);
      setState((_state) => [..._state, data]);
    });
  }, []);

  useEffect(() => {
    socket.on("messageWrite", ({ data }) => {
      const { isWrite, user } = data;
      console.log(user.name);
      if (user.name === params.user) {
        return;
      }
      const isUser = userWrite.find((_user) => _user.name === user.name);
      //маємо добавити в масив нового користувача який набирає текст
      if (isWrite) {
        //Находимо користувача в масиві
        //Добавляємо нового який набирає текст
        if (!isUser) {
          console.log("1111111111111111111111111111111111111111", isUser);
          console.log(userWrite);
          // setUserWrite([...userWrite, { name: user.name }]);
          setUserWrite((prevUserWrite) => [
            ...prevUserWrite,
            { name: user.name },
          ]);
        }
      } else {
        //тут видаляємо користувача який закінчив набирати текст

        //Видаляємо користувача який набирає текст
        if (!isUser) {
          setUserWrite(userWrite.filter((_user) => _user.name !== user.name));
        }
      }
      // console.log(data);
    });
  }, []);

  useEffect(() => {
    socket.on("room", ({ data: { users } }) => {
      console.log(socket);
      setUsers(users.length);
      setUsersName(users);
    });
  }, []);

  const leftRoom = () => {
    socket.emit("leftRoom", { params });
    navigate("/");
  };

  const onEmojiClick = ({ emoji }) => setMessage(`${message} ${emoji}`);

  return (
    <div className={styles.wrap}>
      <Header
        leftRoom={leftRoom}
        params={params}
        users={users}
        isWrite={isWrite}
      />
      {/* <header className={styles.header}>
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
      </header> */}

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

      <Footer
        handleSubmit={handleSubmit}
        onEmojiClick={onEmojiClick}
        handleChange={handleChange}
        message={message}
      />

      {/* <footer className={styles.footer}>
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
      </footer> */}
    </div>
  );
};

export default Chat;
