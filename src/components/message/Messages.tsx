import React, { useEffect, useRef } from "react";
import { IState } from "../interface";

import styles from "./Messages.module.scss";
interface IMessage {
  messages: IState[];
  name: string;
}

const Messages: React.FC<IMessage> = ({ messages, name }) => {
  const lastUserRef = useRef<HTMLDivElement | null>(null); // Реф на последний элемент
  console.log("mesage", messages);
  useEffect(() => {
    if (lastUserRef.current) {
      lastUserRef.current.scrollIntoView({ behavior: "smooth" }); // Прокрутка вниз  { behavior: "smooth" } - плавная прокрутка
    }
  }, [messages]); // Сработает каждый раз, когда изменится список usersName

  return (
    <div className={styles.messages}>
      {messages.map(({ user, message }: IState, i: number) => {
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
