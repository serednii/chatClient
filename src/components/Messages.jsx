import React, { useEffect, useRef } from "react";

import styles from "../styles/Messages.module.css";

const Messages = ({ messages, name }) => {
  const lastUserRef = useRef(null); // Реф на последний элемент

  useEffect(() => {
    if (lastUserRef.current) {
      lastUserRef.current.scrollIntoView({ behavior: "smooth" }); // Прокрутка вниз  { behavior: "smooth" } - плавная прокрутка
    }
  }, [messages]); // Сработает каждый раз, когда изменится список usersName

  return (
    <div className={styles.messages}>
      {messages.map(({ user, message }, i) => {
        const itsMe =
          user.name.trim().toLowerCase() === name.trim().toLowerCase();
        const className = itsMe ? styles.me : styles.user;
        return (
          <div
            key={i}
            ref={i === messages.length - 1 ? lastUserRef : null}
            className={`${styles.message} ${className}`}
          >
            <span className={styles.user}>{user.name}</span>
            <div className={styles.text}>{message}</div>
          </div>
        );
      })}
    </div>
  );
};

export default Messages;
